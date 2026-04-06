"""
History model helpers for the CALC Scientific Calculator.

Provides MongoDB query builders, aggregation pipelines, response
serialization utilities, and index management for the
``calculation_history`` collection.

This module is a **pure data-access helper layer**.  It contains no HTTP
concerns, no Flask request/response handling, and no business logic.
Every public function is stateless — it accepts explicit inputs and
returns query dicts, pipeline lists, or serialized response dicts.  The
sole exception is :func:`ensure_indexes`, which has the side-effect of
creating database indexes.

Functions are consumed primarily by
``backend.services.history_service.HistoryService``.

Query Construction Safety
-------------------------
Per AAP Section 0.7.5 all MongoDB queries use PyMongo's parameterized
dict-based query interface.  **String interpolation into query documents
is strictly prohibited** — every query is built as a plain Python
dictionary with values passed in as native types.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, List, Tuple

from bson import ObjectId
import pymongo

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

COLLECTION_NAME: str = "calculation_history"
"""Name of the MongoDB collection that stores calculation history entries.

Every query builder and the :func:`ensure_indexes` helper reference this
constant so that the collection name is defined in exactly one place.
"""

# ---------------------------------------------------------------------------
# Query Builder Functions
# ---------------------------------------------------------------------------


def build_user_history_query(user_id: str) -> dict:
    """Build a MongoDB filter to retrieve all history entries for a user.

    Parameters
    ----------
    user_id : str
        Auth0 ``sub`` claim that uniquely identifies the user.

    Returns
    -------
    dict
        A filter document ``{"user_id": <user_id>}`` suitable for
        ``collection.find()`` or ``collection.count_documents()``.

    Raises
    ------
    ValueError
        If *user_id* is not a non-empty string.

    Examples
    --------
    >>> build_user_history_query("auth0|abc123")
    {'user_id': 'auth0|abc123'}
    """
    if not isinstance(user_id, str) or not user_id.strip():
        raise ValueError("user_id must be a non-empty string.")

    return {"user_id": user_id}


def build_user_history_query_with_pagination(
    user_id: str,
    page: int = 1,
    limit: int = 25,
) -> Tuple[dict, int, int]:
    """Build a paginated filter query for a user's calculation history.

    The caller is responsible for applying the sort order (``created_at``
    descending) when executing the query against MongoDB.

    Per AAP Section 0.7.3 the default page size is **25** entries and
    results are ordered most-recent-first.

    Parameters
    ----------
    user_id : str
        Auth0 ``sub`` claim identifying the user.
    page : int, optional
        1-based page number (default ``1``).
    limit : int, optional
        Maximum entries per page (default ``25``).

    Returns
    -------
    tuple[dict, int, int]
        A 3-tuple of ``(filter_dict, skip_count, limit_count)`` where:

        * **filter_dict** — MongoDB filter document.
        * **skip_count** — Number of documents to skip (``(page - 1) * limit``).
        * **limit_count** — Maximum documents to return.

    Raises
    ------
    ValueError
        If *user_id* is empty, *page* < 1, or *limit* < 1.

    Examples
    --------
    >>> q, skip, lim = build_user_history_query_with_pagination("auth0|u1")
    >>> q
    {'user_id': 'auth0|u1'}
    >>> skip, lim
    (0, 25)

    >>> q, skip, lim = build_user_history_query_with_pagination(
    ...     "auth0|u1", page=3, limit=10)
    >>> skip
    20
    """
    if not isinstance(user_id, str) or not user_id.strip():
        raise ValueError("user_id must be a non-empty string.")
    if not isinstance(page, int) or page < 1:
        raise ValueError("page must be a positive integer (1-based).")
    if not isinstance(limit, int) or limit < 1:
        raise ValueError("limit must be a positive integer.")

    filter_dict: dict = {"user_id": user_id}
    skip_count: int = (page - 1) * limit
    limit_count: int = limit

    return filter_dict, skip_count, limit_count


def build_delete_query(entry_id: str) -> dict:
    """Build a filter to delete a single history entry by its ``_id``.

    The string *entry_id* is converted to a BSON ``ObjectId`` so that it
    can be matched against MongoDB's auto-generated ``_id`` field.

    Parameters
    ----------
    entry_id : str
        The 24-character hex string representation of the entry's
        ``ObjectId``.

    Returns
    -------
    dict
        ``{"_id": ObjectId(entry_id)}``.

    Raises
    ------
    ValueError
        If *entry_id* is not a non-empty string.
    bson.errors.InvalidId
        If *entry_id* is not a valid 24-character hex ObjectId string.

    Examples
    --------
    >>> q = build_delete_query("507f1f77bcf86cd799439011")
    >>> q["_id"]
    ObjectId('507f1f77bcf86cd799439011')
    """
    if not isinstance(entry_id, str) or not entry_id.strip():
        raise ValueError("entry_id must be a non-empty string.")

    return {"_id": ObjectId(entry_id)}


def build_delete_all_query(user_id: str) -> dict:
    """Build a filter to delete **all** history entries for a user.

    Parameters
    ----------
    user_id : str
        Auth0 ``sub`` claim identifying the user.

    Returns
    -------
    dict
        ``{"user_id": <user_id>}``.

    Raises
    ------
    ValueError
        If *user_id* is not a non-empty string.

    Examples
    --------
    >>> build_delete_all_query("auth0|abc123")
    {'user_id': 'auth0|abc123'}
    """
    if not isinstance(user_id, str) or not user_id.strip():
        raise ValueError("user_id must be a non-empty string.")

    return {"user_id": user_id}


# ---------------------------------------------------------------------------
# Aggregation Pipeline Functions
# ---------------------------------------------------------------------------


def build_statistics_pipeline(user_id: str) -> List[dict]:
    """Build a MongoDB aggregation pipeline for per-user history statistics.

    The pipeline computes:
    * The count of calculations **per operation type** (standard vs
      scientific).
    * The **total** number of calculations across all types.

    Pipeline stages
    ---------------
    1. ``$match``  — filter documents belonging to *user_id*.
    2. ``$group``  — group by ``operation_type`` and count per group.
    3. ``$group``  — collapse all groups into a single result document
       containing a ``by_type`` array and a ``total`` count.

    Parameters
    ----------
    user_id : str
        Auth0 ``sub`` claim identifying the user.

    Returns
    -------
    list[dict]
        A list of aggregation pipeline stage dictionaries.

    Raises
    ------
    ValueError
        If *user_id* is not a non-empty string.

    Examples
    --------
    >>> pipeline = build_statistics_pipeline("auth0|u1")
    >>> len(pipeline)
    3
    >>> pipeline[0]
    {'$match': {'user_id': 'auth0|u1'}}
    """
    if not isinstance(user_id, str) or not user_id.strip():
        raise ValueError("user_id must be a non-empty string.")

    return [
        {"$match": {"user_id": user_id}},
        {
            "$group": {
                "_id": "$operation_type",
                "count": {"$sum": 1},
            }
        },
        {
            "$group": {
                "_id": None,
                "by_type": {"$push": {"type": "$_id", "count": "$count"}},
                "total": {"$sum": "$count"},
            }
        },
    ]


# ---------------------------------------------------------------------------
# Response Serialization Functions
# ---------------------------------------------------------------------------


def serialize_history_entry(entry: dict) -> dict:
    """Convert a raw MongoDB document into a JSON-serializable dict.

    Transformations applied:

    * ``_id`` (``ObjectId``) → ``"id"`` (``str``)
    * ``created_at`` (``datetime``) → ISO 8601 string
    * ``expires_at`` (``datetime``) → ISO 8601 string (or ``None`` if
      absent)
    * Optional fields (``scientific_function``, ``angle_unit``) use
      ``.get()`` to default to ``None`` when missing.

    Parameters
    ----------
    entry : dict
        A document dict as returned by PyMongo's ``find_one()`` or an
        element of ``find()``'s cursor.

    Returns
    -------
    dict
        A JSON-safe dictionary with ``id`` instead of ``_id`` and all
        ``datetime`` values serialized as ISO 8601 strings.

    Raises
    ------
    KeyError
        If required fields (``_id``, ``user_id``, ``expression``,
        ``result``, ``operation_type``, ``created_at``) are missing
        from *entry*.
    AttributeError
        If ``created_at`` is not a ``datetime`` instance (i.e. calling
        ``.isoformat()`` fails).

    Examples
    --------
    >>> from bson import ObjectId
    >>> from datetime import datetime, timezone
    >>> entry = {
    ...     "_id": ObjectId("507f1f77bcf86cd799439011"),
    ...     "user_id": "auth0|u1",
    ...     "expression": "2+3",
    ...     "result": 5.0,
    ...     "operation_type": "standard",
    ...     "created_at": datetime(2025, 1, 1, tzinfo=timezone.utc),
    ... }
    >>> serialized = serialize_history_entry(entry)
    >>> serialized["id"]
    '507f1f77bcf86cd799439011'
    >>> serialized["created_at"]
    '2025-01-01T00:00:00+00:00'
    """
    # Build the expires_at value safely — may be absent or None
    raw_expires: Any = entry.get("expires_at")
    expires_at_iso: str | None = (
        raw_expires.isoformat() if isinstance(raw_expires, datetime) else None
    )

    return {
        "id": str(entry["_id"]),
        "user_id": entry["user_id"],
        "expression": entry["expression"],
        "result": entry["result"],
        "operation_type": entry["operation_type"],
        "scientific_function": entry.get("scientific_function"),
        "angle_unit": entry.get("angle_unit"),
        "created_at": entry["created_at"].isoformat(),
        "expires_at": expires_at_iso,
    }


def serialize_history_list(entries: List[dict]) -> List[dict]:
    """Serialize a list of MongoDB history documents.

    Convenience wrapper that applies :func:`serialize_history_entry` to
    every element in *entries*.

    Parameters
    ----------
    entries : list[dict]
        An iterable of raw MongoDB documents (e.g. the result of
        ``list(collection.find(...))``.

    Returns
    -------
    list[dict]
        A list of JSON-safe dictionaries.

    Examples
    --------
    >>> serialize_history_list([])
    []
    """
    return [serialize_history_entry(entry) for entry in entries]


# ---------------------------------------------------------------------------
# Index Creation Helpers
# ---------------------------------------------------------------------------


def ensure_indexes(db: Any) -> None:
    """Create the required indexes on the ``calculation_history`` collection.

    Three indexes are created per AAP Section 0.4.3:

    1. **idx_user_id** — Standard ascending index on ``user_id`` for
       fast per-user lookups.
    2. **idx_created_at** — Descending index on ``created_at`` for
       chronological ordering (most-recent-first queries).
    3. **idx_ttl_expires** — TTL index on ``expires_at`` with
       ``expireAfterSeconds=0`` so that documents are automatically
       removed at their exact ``expires_at`` datetime.

    Parameters
    ----------
    db : pymongo.database.Database
        A PyMongo ``Database`` instance (not a collection).  The
        collection is accessed internally via ``db[COLLECTION_NAME]``.

    Returns
    -------
    None

    Notes
    -----
    ``create_index`` is idempotent — calling this function multiple times
    will not raise an error or duplicate existing indexes (as long as the
    index specifications are identical).
    """
    collection = db[COLLECTION_NAME]

    # 1. Standard index on user_id for fast per-user lookups
    collection.create_index(
        "user_id",
        name="idx_user_id",
    )

    # 2. Descending index on created_at for chronological ordering
    collection.create_index(
        [("created_at", pymongo.DESCENDING)],
        name="idx_created_at",
    )

    # 3. TTL index on expires_at for automatic document expiration
    #    expireAfterSeconds=0 means documents expire at their exact
    #    expires_at datetime value.
    collection.create_index(
        "expires_at",
        name="idx_ttl_expires",
        expireAfterSeconds=0,
    )

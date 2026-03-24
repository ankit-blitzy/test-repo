# AI Endpoints

REST API reference for AI-powered query processing, including simple queries, RAG-based document analysis, and multi-step agent workflows.

All endpoints in this section are prefixed with `/api/ai`. The AI processing engine is powered by LangChain 1.2.10 and supports three distinct processing patterns, each optimized for different use cases.

**Authentication:** All AI endpoints require a valid Bearer JWT token in the `Authorization` header. See the [API Overview](overview.md) for authentication conventions and the [Authentication Endpoints](auth.md) for token acquisition.

*Source: Tech Spec Sections 4.5, 6.1*

## Processing Patterns

The AI engine provides three processing patterns with increasing capability and response time:

| Pattern | Endpoint | Description | Typical Response Time |
| --- | --- | --- | --- |
| **Simple Query** | `POST /api/ai/query` | Direct LLM interaction for straightforward questions and task suggestions | 1–3 seconds |
| **RAG** | `POST /api/ai/rag` | Context-enriched responses using document retrieval and vector embeddings | 2–5 seconds |
| **Multi-Step Agent** | `POST /api/ai/agent` | Complex workflows with tool-calling capabilities for multi-step task processing | 5–30 seconds |

> **Note:** AI endpoints have longer response times compared to CRUD endpoints due to LLM processing. Each request consumes LLM tokens, and token usage is included in response metadata for cost tracking. See [Response Metadata](#response-metadata) for details.

**Rate Limiting:** AI endpoints are rate-limited to **10 requests per minute** — stricter than CRUD endpoints — to manage LLM provider costs. See [API Overview — Rate Limiting](overview.md#rate-limiting) for details and best practices.

For detailed usage patterns, prompt engineering tips, and workflow examples, see the [AI Features Guide](../guides/ai-features.md).

## Table of Contents

- [Simple Query](#simple-query)
- [RAG Query](#rag-query)
- [Agent Query](#agent-query)
- [Response Metadata](#response-metadata)
- [Error Responses](#error-responses)

---

## Simple Query

Processes a natural language query using direct LLM interaction. Suitable for straightforward questions, task suggestions, priority recommendations, and simple text generation. This is the fastest AI processing pattern with typical response times of 1–3 seconds.

**Method and URL:**

```text
POST /api/ai/query
```

**Authentication:** Required — Bearer JWT token.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes |
| `Content-Type` | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | string | Yes | Natural language query (max 2000 characters) |
| `context` | object | No | Additional context for the query |
| `context.todo_id` | string | No | Reference to a specific to-do item for context (MongoDB ObjectId) |
| `context.include_history` | boolean | No | Include recent conversation history (default: `false`) |
| `max_tokens` | integer | No | Maximum tokens in response (default: `500`, max: `2000`) |
| `temperature` | number | No | Response creativity from `0.0` to `1.0` (default: `0.7`) |

**Request body example:**

```json
{
  "query": "Suggest three subtasks for my 'Launch marketing campaign' todo",
  "context": {
    "todo_id": "507f1f77bcf86cd799439011",
    "include_history": false
  },
  "max_tokens": 500,
  "temperature": 0.7
}
```

### Response Body (200 OK)

```json
{
  "response": "Here are three subtasks for your 'Launch marketing campaign' todo:\n\n1. **Design social media assets** — Create graphics and copy for Twitter, LinkedIn, and Instagram posts\n2. **Draft email campaign** — Write the announcement email and set up the email automation sequence\n3. **Prepare analytics dashboard** — Set up tracking for campaign KPIs including click-through rates and conversions",
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 1850,
    "tokens_used": {
      "prompt": 125,
      "completion": 180,
      "total": 305
    },
    "processing_pattern": "simple"
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `response` | string | The AI-generated response text |
| `metadata` | object | Processing metadata including model, timing, and token usage |
| `metadata.model` | string | LLM model used for processing (e.g., `gpt-4`) |
| `metadata.processing_time_ms` | integer | Total processing time in milliseconds |
| `metadata.tokens_used` | object | Token consumption breakdown |
| `metadata.tokens_used.prompt` | integer | Tokens used for the prompt/input |
| `metadata.tokens_used.completion` | integer | Tokens used for the response/output |
| `metadata.tokens_used.total` | integer | Total tokens consumed (prompt + completion) |
| `metadata.processing_pattern` | string | Processing pattern used: `simple` |

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | Query processed successfully |
| `400 Bad Request` | Invalid request body or empty query |
| `401 Unauthorized` | Missing or invalid authentication token |
| `422 Unprocessable Entity` | Validation failed (e.g., query exceeds 2000 characters, invalid temperature value) |
| `429 Too Many Requests` | AI processing rate limit exceeded (10 requests per minute) |
| `500 Internal Server Error` | Server-side error |
| `503 Service Unavailable` | LLM provider unavailable |

### Examples

**cURL:**

```bash
curl -X POST "http://localhost:5000/api/ai/query" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Suggest three subtasks for my Launch marketing campaign todo",
    "context": {
      "todo_id": "507f1f77bcf86cd799439011",
      "include_history": false
    },
    "max_tokens": 500,
    "temperature": 0.7
  }'
```

**Python:**

```python
import requests

access_token = "YOUR_ACCESS_TOKEN"

response = requests.post(
    "http://localhost:5000/api/ai/query",
    headers={
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    },
    json={
        "query": "Suggest three subtasks for my 'Launch marketing campaign' todo",
        "context": {
            "todo_id": "507f1f77bcf86cd799439011",
            "include_history": False
        },
        "max_tokens": 500,
        "temperature": 0.7
    }
)

data = response.json()
print(f"AI Response: {data['response']}")
print(f"Tokens used: {data['metadata']['tokens_used']['total']}")
print(f"Processing time: {data['metadata']['processing_time_ms']}ms")
```

**JavaScript:**

```javascript
const accessToken = "YOUR_ACCESS_TOKEN";

const response = await fetch("http://localhost:5000/api/ai/query", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: "Suggest three subtasks for my 'Launch marketing campaign' todo",
    context: {
      todo_id: "507f1f77bcf86cd799439011",
      include_history: false
    },
    max_tokens: 500,
    temperature: 0.7
  })
});

const data = await response.json();
console.log(`AI Response: ${data.response}`);
console.log(`Tokens used: ${data.metadata.tokens_used.total}`);
console.log(`Processing time: ${data.metadata.processing_time_ms}ms`);
```

---

## RAG Query

Processes a query using Retrieval-Augmented Generation (RAG). The system retrieves relevant documents and context from the vector store (MongoDB Atlas Vector Search with embeddings) to provide more informed, context-specific responses.

Best suited for questions about specific to-do items, project context, or when referencing stored documents.

Typical response times are 2–5 seconds.

**Method and URL:**

```text
POST /api/ai/rag
```

**Authentication:** Required — Bearer JWT token.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes |
| `Content-Type` | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | string | Yes | Natural language query (max 2000 characters) |
| `collection` | string | No | Target collection to search: `todos` or `documents` (default: `todos`) |
| `top_k` | integer | No | Number of relevant documents to retrieve (default: `5`, max: `20`) |
| `context` | object | No | Additional context for the query |
| `context.filters` | object | No | Metadata filters for document retrieval (e.g., `{"priority": "high", "completed": false}`) |
| `max_tokens` | integer | No | Maximum tokens in response (default: `1000`, max: `4000`) |
| `temperature` | number | No | Response creativity from `0.0` to `1.0` (default: `0.3`) |

> **Note:** The lower default temperature (`0.3`) for RAG queries reflects the preference for factual, context-grounded responses over creative generation.

**Request body example:**

```json
{
  "query": "What are my high priority tasks due this week?",
  "collection": "todos",
  "top_k": 10,
  "context": {
    "filters": {
      "priority": "high",
      "completed": false
    }
  },
  "max_tokens": 1000,
  "temperature": 0.3
}
```

### Response Body (200 OK)

```json
{
  "response": "Based on your to-do items, you have 3 high-priority tasks due this week:\n\n1. **Review pull request #42** (Due: March 25) — Authentication module review\n2. **Deploy staging environment** (Due: March 26) — Infrastructure setup\n3. **Client presentation prep** (Due: March 27) — Q1 results presentation",
  "sources": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Review pull request #42",
      "relevance_score": 0.95
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Deploy staging environment",
      "relevance_score": 0.91
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "title": "Client presentation prep",
      "relevance_score": 0.88
    }
  ],
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 3200,
    "tokens_used": {
      "prompt": 850,
      "completion": 220,
      "total": 1070
    },
    "processing_pattern": "rag",
    "documents_retrieved": 3
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `response` | string | The AI-generated response grounded in retrieved documents |
| `sources` | array | List of retrieved documents used to generate the response |
| `sources[].id` | string | MongoDB ObjectId of the source document |
| `sources[].title` | string | Title of the source document |
| `sources[].relevance_score` | number | Relevance score from `0.0` to `1.0` (higher is more relevant) |
| `metadata` | object | Processing metadata including model, timing, and token usage |
| `metadata.model` | string | LLM model used for processing |
| `metadata.processing_time_ms` | integer | Total processing time in milliseconds |
| `metadata.tokens_used` | object | Token consumption breakdown |
| `metadata.tokens_used.prompt` | integer | Tokens used for the prompt/input (includes retrieved document context) |
| `metadata.tokens_used.completion` | integer | Tokens used for the response/output |
| `metadata.tokens_used.total` | integer | Total tokens consumed (prompt + completion) |
| `metadata.processing_pattern` | string | Processing pattern used: `rag` |
| `metadata.documents_retrieved` | integer | Number of documents retrieved from the vector store |

> **Note:** The `sources` array lists the retrieved documents used to generate the response, ordered by relevance score (highest first). Relevance scores range from `0.0` (no relevance) to `1.0` (exact match). Use these scores to assess the confidence level of the response.

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | Query processed successfully |
| `400 Bad Request` | Invalid request body or empty query |
| `401 Unauthorized` | Missing or invalid authentication token |
| `422 Unprocessable Entity` | Validation failed (e.g., invalid collection name, `top_k` exceeds maximum) |
| `429 Too Many Requests` | AI processing rate limit exceeded (10 requests per minute) |
| `500 Internal Server Error` | Server-side error |
| `503 Service Unavailable` | LLM provider or vector store unavailable |

### Examples

**cURL:**

```bash
curl -X POST "http://localhost:5000/api/ai/rag" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are my high priority tasks due this week?",
    "collection": "todos",
    "top_k": 10,
    "context": {
      "filters": {
        "priority": "high",
        "completed": false
      }
    },
    "max_tokens": 1000,
    "temperature": 0.3
  }'
```

**Python:**

```python
import requests

access_token = "YOUR_ACCESS_TOKEN"

response = requests.post(
    "http://localhost:5000/api/ai/rag",
    headers={
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    },
    json={
        "query": "What are my high priority tasks due this week?",
        "collection": "todos",
        "top_k": 10,
        "context": {
            "filters": {
                "priority": "high",
                "completed": False
            }
        },
        "max_tokens": 1000,
        "temperature": 0.3
    }
)

data = response.json()
print(f"AI Response: {data['response']}")

# Display retrieved sources with relevance scores
for source in data["sources"]:
    print(f"  Source: {source['title']} (relevance: {source['relevance_score']})")

print(f"Documents retrieved: {data['metadata']['documents_retrieved']}")
print(f"Tokens used: {data['metadata']['tokens_used']['total']}")
```

**JavaScript:**

```javascript
const accessToken = "YOUR_ACCESS_TOKEN";

const response = await fetch("http://localhost:5000/api/ai/rag", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: "What are my high priority tasks due this week?",
    collection: "todos",
    top_k: 10,
    context: {
      filters: {
        priority: "high",
        completed: false
      }
    },
    max_tokens: 1000,
    temperature: 0.3
  })
});

const data = await response.json();
console.log(`AI Response: ${data.response}`);

// Display retrieved sources with relevance scores
data.sources.forEach((source) => {
  console.log(`  Source: ${source.title} (relevance: ${source.relevance_score})`);
});

console.log(`Documents retrieved: ${data.metadata.documents_retrieved}`);
console.log(`Tokens used: ${data.metadata.tokens_used.total}`);
```

---

## Agent Query

Processes complex queries using a multi-step AI agent with tool-calling capabilities. The agent can autonomously execute multiple steps — including creating, updating, or querying to-do items — to fulfill the user's request.

This is the most powerful but slowest processing pattern, with typical response times of 5–30 seconds depending on complexity and the number of steps executed.

The agent has access to the user's to-do list and can take actions on the user's behalf when authorized.

**Method and URL:**

```text
POST /api/ai/agent
```

**Authentication:** Required — Bearer JWT token.

> ⚠️ **Caution:** When `allow_mutations` is set to `true`, the agent can create, update, and delete to-do items on your behalf. Review the agent's actions in the `steps` and `mutations` arrays of the response to verify all changes. Set `allow_mutations` to `false` (the default) for read-only analysis.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes |
| `Content-Type` | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | string | Yes | Natural language instruction (max 4000 characters) |
| `context` | object | No | Additional context for the agent |
| `context.allow_mutations` | boolean | No | Allow the agent to create, update, or delete to-do items (default: `false`) |
| `context.max_steps` | integer | No | Maximum number of agent steps (default: `5`, max: `10`) |
| `max_tokens` | integer | No | Maximum tokens in response (default: `2000`, max: `8000`) |

**Request body example:**

```json
{
  "query": "Organize my incomplete todos by priority and create a daily schedule for this week",
  "context": {
    "allow_mutations": false,
    "max_steps": 5
  },
  "max_tokens": 2000
}
```

### Response Body (200 OK)

```json
{
  "response": "Here's your organized weekly schedule based on your incomplete to-do items:\n\n**Monday:**\n- Review pull request #42 (High priority)\n- Update API documentation (Medium)\n\n**Tuesday:**\n- Deploy staging environment (High)\n- Fix login bug #38 (Medium)\n\n**Wednesday:**\n- Client presentation prep (High)\n- Write unit tests for auth module (Medium)\n\n**Thursday:**\n- Database migration planning (Medium)\n- Code review for frontend (Low)\n\n**Friday:**\n- Sprint retrospective notes (Low)\n- Update project README (Low)",
  "steps": [
    {
      "step": 1,
      "action": "retrieve_todos",
      "description": "Retrieved 12 incomplete todos",
      "status": "completed"
    },
    {
      "step": 2,
      "action": "analyze",
      "description": "Sorted todos by priority and due date",
      "status": "completed"
    },
    {
      "step": 3,
      "action": "generate_schedule",
      "description": "Created weekly schedule based on priorities and deadlines",
      "status": "completed"
    }
  ],
  "mutations": [],
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 12500,
    "tokens_used": {
      "prompt": 2200,
      "completion": 1500,
      "total": 3700
    },
    "processing_pattern": "agent",
    "steps_executed": 3,
    "steps_limit": 5
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `response` | string | The AI-generated response summarizing the agent's work |
| `steps` | array | The agent's reasoning process — each step with action, description, and status |
| `steps[].step` | integer | Step number in the execution sequence |
| `steps[].action` | string | Action type performed (e.g., `retrieve_todos`, `analyze`, `create_todo`, `update_todo`, `delete_todo`, `generate_schedule`) |
| `steps[].description` | string | Human-readable description of what the step accomplished |
| `steps[].status` | string | Step completion status: `completed`, `failed`, or `skipped` |
| `mutations` | array | List of to-do items created, updated, or deleted by the agent (empty when `allow_mutations` is `false`) |
| `mutations[].action` | string | Mutation type: `create`, `update`, or `delete` |
| `mutations[].resource` | string | Resource type affected (e.g., `todo`) |
| `mutations[].id` | string | MongoDB ObjectId of the affected resource |
| `mutations[].title` | string | Title of the affected to-do item |
| `metadata` | object | Processing metadata including model, timing, and token usage |
| `metadata.model` | string | LLM model used for processing |
| `metadata.processing_time_ms` | integer | Total processing time in milliseconds |
| `metadata.tokens_used` | object | Token consumption breakdown |
| `metadata.tokens_used.prompt` | integer | Tokens used for the prompt/input |
| `metadata.tokens_used.completion` | integer | Tokens used for the response/output |
| `metadata.tokens_used.total` | integer | Total tokens consumed (prompt + completion) |
| `metadata.processing_pattern` | string | Processing pattern used: `agent` |
| `metadata.steps_executed` | integer | Number of steps the agent actually executed |
| `metadata.steps_limit` | integer | Maximum steps allowed for this request |

### Mutations Example

When `allow_mutations` is set to `true` and the agent creates, updates, or deletes to-do items, the `mutations` array contains the details of each change:

```json
{
  "query": "Create three subtasks for my marketing campaign todo",
  "context": {
    "allow_mutations": true,
    "max_steps": 5
  },
  "max_tokens": 2000
}
```

The response `mutations` array would contain:

```json
{
  "mutations": [
    {
      "action": "create",
      "resource": "todo",
      "id": "507f1f77bcf86cd799439020",
      "title": "Design social media assets for campaign"
    },
    {
      "action": "create",
      "resource": "todo",
      "id": "507f1f77bcf86cd799439021",
      "title": "Draft email campaign sequence"
    },
    {
      "action": "create",
      "resource": "todo",
      "id": "507f1f77bcf86cd799439022",
      "title": "Prepare analytics dashboard for KPI tracking"
    }
  ]
}
```

> **Note:** When `allow_mutations` is `false` (the default), the `mutations` array is always empty. The agent performs read-only analysis and generates suggestions without modifying any data.

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | Agent completed processing successfully |
| `400 Bad Request` | Invalid request body or empty query |
| `401 Unauthorized` | Missing or invalid authentication token |
| `408 Request Timeout` | Agent processing exceeded the timeout limit |
| `422 Unprocessable Entity` | Validation failed (e.g., `max_steps` exceeds maximum of 10) |
| `429 Too Many Requests` | AI processing rate limit exceeded (10 requests per minute) |
| `500 Internal Server Error` | Server-side error or agent execution failure |
| `503 Service Unavailable` | LLM provider unavailable |

### Examples

**cURL:**

```bash
curl -X POST "http://localhost:5000/api/ai/agent" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Organize my incomplete todos by priority and create a daily schedule for this week",
    "context": {
      "allow_mutations": false,
      "max_steps": 5
    },
    "max_tokens": 2000
  }'
```

**cURL (with mutations enabled):**

```bash
curl -X POST "http://localhost:5000/api/ai/agent" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Create three subtasks for my marketing campaign todo",
    "context": {
      "allow_mutations": true,
      "max_steps": 5
    },
    "max_tokens": 2000
  }'
```

**Python:**

```python
import requests

access_token = "YOUR_ACCESS_TOKEN"

# Read-only agent query (allow_mutations defaults to false)
response = requests.post(
    "http://localhost:5000/api/ai/agent",
    headers={
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    },
    json={
        "query": "Organize my incomplete todos by priority and create a daily schedule for this week",
        "context": {
            "allow_mutations": False,
            "max_steps": 5
        },
        "max_tokens": 2000
    }
)

data = response.json()
print(f"AI Response: {data['response']}")

# Display agent steps
for step in data["steps"]:
    print(f"  Step {step['step']}: [{step['status']}] {step['action']} — {step['description']}")

# Check for mutations (empty when allow_mutations is false)
if data["mutations"]:
    print("Mutations performed:")
    for mutation in data["mutations"]:
        print(f"  {mutation['action']} {mutation['resource']}: {mutation['title']} (ID: {mutation['id']})")
else:
    print("No mutations — read-only analysis")

print(f"Steps executed: {data['metadata']['steps_executed']}/{data['metadata']['steps_limit']}")
print(f"Tokens used: {data['metadata']['tokens_used']['total']}")
print(f"Processing time: {data['metadata']['processing_time_ms']}ms")
```

**JavaScript:**

```javascript
const accessToken = "YOUR_ACCESS_TOKEN";

// Read-only agent query (allow_mutations defaults to false)
const response = await fetch("http://localhost:5000/api/ai/agent", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: "Organize my incomplete todos by priority and create a daily schedule for this week",
    context: {
      allow_mutations: false,
      max_steps: 5
    },
    max_tokens: 2000
  })
});

const data = await response.json();
console.log(`AI Response: ${data.response}`);

// Display agent steps
data.steps.forEach((step) => {
  console.log(`  Step ${step.step}: [${step.status}] ${step.action} — ${step.description}`);
});

// Check for mutations (empty when allow_mutations is false)
if (data.mutations.length > 0) {
  console.log("Mutations performed:");
  data.mutations.forEach((mutation) => {
    console.log(`  ${mutation.action} ${mutation.resource}: ${mutation.title} (ID: ${mutation.id})`);
  });
} else {
  console.log("No mutations — read-only analysis");
}

console.log(`Steps executed: ${data.metadata.steps_executed}/${data.metadata.steps_limit}`);
console.log(`Tokens used: ${data.metadata.tokens_used.total}`);
console.log(`Processing time: ${data.metadata.processing_time_ms}ms`);
```

---

## Response Metadata

All AI endpoint responses include a `metadata` object with processing details. Use this information for cost tracking, performance monitoring, and debugging.

### Common Metadata Fields

| Field | Type | Description |
| --- | --- | --- |
| `metadata.model` | string | LLM model used for processing (e.g., `gpt-4`) |
| `metadata.processing_time_ms` | integer | Total server-side processing time in milliseconds |
| `metadata.tokens_used.prompt` | integer | Tokens consumed by the prompt/input (includes system prompt and any retrieved context) |
| `metadata.tokens_used.completion` | integer | Tokens consumed by the generated response/output |
| `metadata.tokens_used.total` | integer | Total tokens consumed (`prompt` + `completion`) |
| `metadata.processing_pattern` | string | Processing pattern used: `simple`, `rag`, or `agent` |

### Pattern-Specific Metadata Fields

In addition to the common fields above, each processing pattern includes additional metadata:

| Field | Type | Patterns | Description |
| --- | --- | --- | --- |
| `metadata.documents_retrieved` | integer | RAG | Number of documents retrieved from the vector store |
| `metadata.steps_executed` | integer | Agent | Number of steps the agent executed |
| `metadata.steps_limit` | integer | Agent | Maximum steps allowed for the request |

### Token Usage Guidance

- **Monitor token consumption** using the `tokens_used` fields to track costs across your application.
- **Prompt tokens** vary by processing pattern — RAG queries consume more prompt tokens because retrieved documents are included in the context.
- **Completion tokens** are controlled by the `max_tokens` request parameter. Setting a lower `max_tokens` value reduces costs but may truncate responses.
- **Total tokens** are the sum of prompt and completion tokens and directly correspond to LLM provider billing.
- Use the `processing_time_ms` field to monitor latency and set appropriate client-side timeouts.

---

## Error Responses

AI endpoints follow the standard error response format defined in the [API Overview](overview.md#error-responses). All error responses use the following structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error message"
      }
    ]
  }
}
```

### AI-Specific Error Scenarios

| Scenario | Status Code | Error Code | Example Message |
| --- | --- | --- | --- |
| Empty or missing query | `400` | `MISSING_FIELD` | `"The 'query' field is required and cannot be empty"` |
| Query exceeds max length | `422` | `VALIDATION_ERROR` | `"Query exceeds maximum length of 2000 characters"` |
| Invalid temperature value | `422` | `VALIDATION_ERROR` | `"Temperature must be between 0.0 and 1.0"` |
| Invalid `max_tokens` value | `422` | `VALIDATION_ERROR` | `"max_tokens must be between 1 and 2000 for simple queries"` |
| Invalid `top_k` value (RAG) | `422` | `VALIDATION_ERROR` | `"top_k must be between 1 and 20"` |
| Invalid `max_steps` value (Agent) | `422` | `VALIDATION_ERROR` | `"max_steps must be between 1 and 10"` |
| Invalid collection name (RAG) | `422` | `VALIDATION_ERROR` | `"Collection must be 'todos' or 'documents'"` |
| Missing or invalid token | `401` | `INVALID_TOKEN` | `"Authentication token is missing or invalid"` |
| Expired token | `401` | `TOKEN_EXPIRED` | `"Authentication token has expired"` |
| Rate limit exceeded | `429` | `RATE_LIMITED` | `"Too many requests. Please retry after 45 seconds."` |
| Agent processing timeout | `408` | `REQUEST_TIMEOUT` | `"Agent processing exceeded the timeout limit"` |
| Agent execution failure | `500` | `INTERNAL_ERROR` | `"An unexpected error occurred during agent processing"` |
| LLM provider unavailable | `503` | `SERVICE_UNAVAILABLE` | `"AI processing service is temporarily unavailable"` |
| LLM provider API key invalid | `503` | `SERVICE_UNAVAILABLE` | `"AI processing service configuration error"` |

### Error Response Examples

**Validation error (422):**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "temperature",
        "message": "Temperature must be between 0.0 and 1.0"
      }
    ]
  }
}
```

**Rate limit exceeded (429):**

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please retry after 45 seconds.",
    "retry_after": 45
  }
}
```

**LLM provider unavailable (503):**

```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "AI processing service is temporarily unavailable. Please try again later."
  }
}
```

> **Security note:** When the LLM provider (e.g., OpenAI, Anthropic) is unavailable or returns an error, the API returns a `503` with a generic error message. The application does not expose the underlying provider's error details to prevent leaking internal infrastructure information.

See [Troubleshooting](../troubleshooting.md) for common error resolution steps.

*Source: Tech Spec Sections 4.5, 6.1*

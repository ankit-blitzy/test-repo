# =============================================================================
# CALC Scientific Calculator — Backend Dockerfile
# =============================================================================
# Multi-stage build for the Python/Flask backend service.
# Base image: python:3.13-slim (per AAP Section 0.3.1)
# Production server: gunicorn 23.0.0 (WSGI HTTP server)
# Exposed port: 5000 (per AAP Section 0.5.1 Group 1)
# =============================================================================

# ---------------------------------------------------------------------------
# Stage: Production runtime
# Uses Python 3.13-slim for minimal image footprint while retaining
# all necessary C libraries for cryptography and PyMongo dependencies.
# ---------------------------------------------------------------------------
FROM python:3.13-slim

# Set the working directory inside the container
WORKDIR /app

# ---------------------------------------------------------------------------
# Dependency Installation (layer caching optimization)
# Copy only the requirements manifest first so that Docker can cache the
# pip install layer independently of application source code changes.
# This avoids re-downloading all packages on every code change.
# ---------------------------------------------------------------------------
COPY requirements.txt .

# Install Python dependencies with no pip cache to reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# ---------------------------------------------------------------------------
# Application Source Code
# Copy all remaining backend source files into the container working dir.
# This layer is invalidated on any source code change, but the dependency
# layer above remains cached.
# ---------------------------------------------------------------------------
COPY . .

# ---------------------------------------------------------------------------
# Environment Variables
# FLASK_APP: Tells Flask which module contains the application instance
# PYTHONUNBUFFERED: Ensures Python output is sent directly to the terminal
#                   without buffering, critical for container log visibility
# ---------------------------------------------------------------------------
ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1

# ---------------------------------------------------------------------------
# Network Configuration
# Expose port 5000 for the Flask/gunicorn backend service.
# Docker Compose maps this to the host via the ports directive.
# ---------------------------------------------------------------------------
EXPOSE 5000

# ---------------------------------------------------------------------------
# Container Entrypoint
# Run the Flask application using gunicorn as the production WSGI server.
# --bind 0.0.0.0:5000  : Listen on all interfaces at port 5000
# --workers 4           : Spawn 4 worker processes for concurrent requests
# app:app               : Import the 'app' variable from the 'app' module
#                         (i.e., backend/app.py -> app = create_app())
# ---------------------------------------------------------------------------
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]

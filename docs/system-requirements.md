# System Requirements

This document lists all technical prerequisites for running and operating the To-Do List Application. It covers runtime environments, database requirements, browser compatibility, operating system support, environment configuration, containerization needs, and minimum hardware recommendations. Use this reference to ensure your development or deployment environment meets all necessary conditions before setting up the application.

[← Back to README](../README.md)

---

## Runtime Requirements

The following runtime components must be installed to develop, build, and run the To-Do List Application:

| Component | Version | Purpose |
|-----------|---------|---------|
| Python | 3.13.x | Backend runtime for Flask services (archie-service-backend) |
| Node.js | LTS (latest) | Frontend build tooling and Vite development server |
| npm | Bundled with Node.js | Package management for frontend dependencies (React, TypeScript, TailwindCSS) |
| MongoDB | 8.0.x | Primary document database for task data storage |

> **Note:** Python 3.13.x is required for the backend. Older Python versions are not supported due to the use of modern language features and Flask 3.1.x compatibility requirements. Node.js LTS is needed exclusively for building the React 19.x / TypeScript 5.7+ frontend and running the Vite 6.x development server.

*Source: Technical Specification §3.1, §3.8*

---

## Database Requirements

The To-Do List Application uses **MongoDB 8.0.x** as its primary data store. MongoDB's document-oriented model is well-suited for storing task data as flexible JSON-like documents.

| Requirement | Details |
|-------------|---------|
| Database Engine | MongoDB 8.0.x |
| Driver | PyMongo 4.16.x (Python MongoDB driver used by archie-service-backend) |
| Default Database Name | `todo_app` |
| Minimum Storage | Sufficient disk space for task collections (lightweight; minimal storage footprint) |
| Connection Options | Local MongoDB instance **or** Docker container (`mongo:8.0` image) |
| Production Alternative | MongoDB Atlas (cloud-hosted) for managed deployment |

### Connection Details

- **Default connection string:** `mongodb://localhost:27017/todo_app`
- **Protocol:** MongoDB wire protocol via PyMongo 4.16.x
- **Authentication:** Optional for local development; recommended for production deployments
- **Replica Sets:** Not required for development; recommended for production high availability

*Source: Technical Specification §3.5, §6.2*

---

## Browser Compatibility

The To-Do List Application's U! frontend is built with React 19.x, TypeScript 5.7+, and TailwindCSS 4.x. It requires modern browsers with ES2020+ JavaScript support.

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Google Chrome | Latest 2 versions | ✅ Fully Supported |
| Mozilla Firefox | Latest 2 versions | ✅ Fully Supported |
| Apple Safari | Latest 2 versions | ✅ Fully Supported |
| Microsoft Edge | Latest 2 versions | ✅ Fully Supported |

> **Note:** Internet Explorer is **not supported**. The React 19.x frontend and Vite 6.x build tooling require modern browser capabilities including ES modules, CSS custom properties, and Fetch API support. All supported browsers must have JavaScript enabled.

*Source: Technical Specification §3.2, §3.8*

---

## Operating System Support

The To-Do List Application can be developed and deployed on the following operating systems:

| Operating System | Supported Versions | Notes |
|------------------|--------------------|-------|
| **Linux** | Ubuntu 20.04+, Debian 11+, RHEL 8+ | Full support — recommended for production deployment |
| **macOS** | macOS 12 (Monterey) or later | Full support — recommended for local development |
| **Windows** | Windows 10 or later | Full support — WSL2 (Windows Subsystem for Linux) recommended for optimal compatibility with Python and MongoDB tooling |

### Platform Notes

- **Linux** is the recommended platform for production deployments and CI/CD pipelines.
- **macOS** provides a native Unix-like development experience with Homebrew-based package management.
- **Windows** users should install WSL2 for the best development experience, as it provides a Linux environment for running Python, Node.js, and MongoDB natively. PowerShell and Command Prompt are also supported but may require additional configuration.

---

## Environment Variables

The To-Do List Application uses environment variables to configure runtime behavior. These variables can be set in a `.env` file at the project root or exported directly in the shell.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `mongodb://localhost:27017/todo_app` | MongoDB connection string for task data storage |
| `APP_PORT` | No | `5000` | Port for the Flask backend server (archie-service-backend) |
| `NODE_ENV` | No | `development` | Environment mode for the frontend (`development` or `production`) |
| `API_BASE_URL` | No | `http://localhost:5000/api` | Backend API base URL used by the U! frontend |
| `FLASK_ENV` | No | `development` | Flask environment mode (`development` or `production`) |
| `FLASK_DEBUG` | No | `1` | Flask debug mode — set to `1` for development (auto-reload), `0` for production |

### Example Configuration

Create a `.env` file in the project root with the following content:

```env
# To-Do List Application — Environment Configuration

# Database
DATABASE_URL=mongodb://localhost:27017/todo_app

# Backend Server
APP_PORT=5000
FLASK_ENV=development
FLASK_DEBUG=1

# Frontend
NODE_ENV=development
API_BASE_URL=http://localhost:5000/api
```

> **Important:** Never commit `.env` files containing sensitive credentials to version control. Add `.env` to your `.gitignore` file. For production deployments, use secure environment variable management provided by your hosting platform.

*Source: Technical Specification §3.6.3*

---

## Docker Requirements

Docker is recommended for running MongoDB locally and for containerized development workflows. The following Docker components are required if using the containerized approach:

| Component | Version | Purpose |
|-----------|---------|---------|
| Docker Engine | 24.x+ | Container runtime for running application and database containers |
| Docker Compose | 2.x+ | Multi-container orchestration for coordinating backend and database services |

### Container Images

The To-Do List Application references the following official Docker images:

| Image | Tag | Purpose |
|-------|-----|---------|
| `mongo` | `8.0` | MongoDB 8.0.x database server for task data storage |
| `python` | `3.13-slim` | Python 3.13.x runtime for building and running archie-service-backend |

### Quick Docker MongoDB Setup

To start a MongoDB 8.0 container for local development:

```bash
docker run -d \
  --name todo-mongo \
  -p 27017:27017 \
  mongo:8.0
```

> **Note:** Docker is optional for development if MongoDB 8.0.x is installed locally. However, Docker provides a consistent, isolated environment and is the recommended approach for ensuring version compatibility.

---

## Minimum Hardware Recommendations

The following hardware specifications are recommended for a smooth development experience with the To-Do List Application:

| Resource | Minimum | Recommended | Notes |
|----------|---------|-------------|-------|
| **RAM** | 4 GB | 8 GB | MongoDB, Flask backend, and Vite frontend dev server run concurrently during development |
| **Disk Space** | 2 GB | 5 GB | Includes application code, `node_modules`, Python virtual environment, and MongoDB data |
| **CPU** | 2 cores | 4 cores | Vite hot module replacement and TypeScript compilation benefit from additional cores |
| **Network** | Internet access | Broadband | Required for downloading dependencies (npm packages, pip packages, Docker images) |

> **Note:** These recommendations are for local development. Production deployment hardware requirements will vary based on expected task volume and concurrent user load.

---

## Cross-References

For additional context and related documentation, refer to:

- **[Getting Started](getting-started.md)** — Step-by-step setup instructions for installing prerequisites, configuring the environment, and running the application locally
- **[Technology Stack](technology-stack.md)** — Full technology stack details with version justifications and a stack layer diagram

---

*Source: Technical Specification §3.1, §3.2, §3.5, §3.6.3, §3.8*

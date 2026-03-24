# Todo Application

![Build Status](https://img.shields.io/github/actions/workflow/status/your-org/todo-app/ci.yml?branch=main&label=build)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Python](https://img.shields.io/badge/python-3.13-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-LTS-green.svg)

A full-stack, AI-powered to-do application designed to help users manage tasks intelligently.
Built with a Python 3.13 / Flask 3.1.3 backend, React 19.2.1 frontend, MongoDB 8.0 database,
Auth0 authentication, and LangChain 1.2.10 AI engine, the Todo Application combines traditional
task management with natural-language processing capabilities — enabling smart categorization,
AI-driven task suggestions, and a conversational interface for an enhanced productivity experience.

<!-- Source: Tech Spec Sections 1.1, 1.2, 2.2, 3.1 -->

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Manual Installation](#manual-installation)
- [Documentation](#documentation)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- ✅ **Task Management** — Full CRUD operations for to-do items including create, read, update, delete, filter, sort, and search. Organize your work with intuitive list views and detailed item editing.

- 🤖 **AI-Powered Processing** — Natural-language task suggestions, smart categorization, and a conversational interface powered by LangChain. Three processing patterns are supported: simple query, retrieval-augmented generation (RAG), and multi-step agent workflows.

- 🔐 **Authentication & Authorization** — Secure user authentication via Auth0 with OAuth 2.0 / OpenID Connect, multi-factor authentication (MFA) support, JWT token management, and role-based access control.

- 🌐 **Multi-Platform Access** — Access your to-do items from the web (React), mobile (React Native), and desktop (Electron) with a consistent experience across all platforms.

- 🐳 **Docker Development** — Docker Compose orchestration with MongoDB, Flask, and React services for a seamless local development experience. One command to spin up the entire stack.

- 📡 **RESTful API** — A complete REST API for all to-do operations, user management, authentication, and AI processing — fully documented with request and response schemas, status codes, and working examples.

<!-- Source: Tech Spec Sections 2.2, 5.1 -->

## Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| Backend | Python | 3.13 |
| Backend Framework | Flask | 3.1.3 |
| Frontend | React | 19.2.1 |
| Frontend Language | TypeScript | 5.9.3 |
| Frontend Styling | TailwindCSS | 4.1.x |
| Database | MongoDB | 8.0 |
| Authentication | Auth0 | OAuth 2.0 / OIDC |
| AI Engine | LangChain | 1.2.10 |
| AI Core | LangChain-Core | 1.2.14 |
| Containerization | Docker & Docker Compose | Latest |
| Cloud Infrastructure | AWS | — |
| Infrastructure as Code | Terraform | Latest |

<!-- Source: Tech Spec Sections 3.1, 3.2, 3.3, 3.8 -->

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.13+** — [Download Python](https://www.python.org/downloads/)
- **Node.js (LTS)** — [Download Node.js](https://nodejs.org/)
- **MongoDB 8.0+** — [Download MongoDB](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Docker & Docker Compose** (recommended) — [Download Docker](https://www.docker.com/products/docker-desktop/)
- **Auth0 Account** — [Sign up for Auth0](https://auth0.com/signup)

## Quick Start

Get the Todo Application running in five steps using Docker Compose:

**1. Clone the repository**

```bash
git clone https://github.com/your-org/todo-app.git
cd todo-app
```

**2. Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` and set the required values:

```bash
# Auth0 Configuration
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN.auth0.com
AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_AUTH0_CLIENT_SECRET
AUTH0_AUDIENCE=YOUR_AUTH0_API_AUDIENCE

# MongoDB Configuration
MONGODB_URI=mongodb://mongodb:27017/todo_app

# LLM Configuration
LLM_PROVIDER=openai
LLM_API_KEY=YOUR_LLM_API_KEY
```

See the [Configuration Reference](docs/getting-started/configuration.md) for the full list of environment variables.

**3. Start the services**

```bash
docker compose up -d
```

**4. Open the application**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

**5. Register and create your first to-do**

Sign up for an account through the Auth0 login screen and create your first to-do item. You are all set!

## Manual Installation

For a manual setup without Docker, follow these steps:

### Backend

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

For complete step-by-step instructions — including MongoDB configuration, Auth0 setup, and environment variable details — see the [Installation Guide](docs/getting-started/installation.md).

## Documentation

Explore the full documentation for detailed guides and references:

### Getting Started

- 📖 [Installation Guide](docs/getting-started/installation.md) — Prerequisites, environment setup, and dependency installation for Docker and manual workflows
- ⚙️ [Configuration Reference](docs/getting-started/configuration.md) — Complete environment variable reference for the application, database, authentication, and AI services
- 🚀 [Quick Start Tutorial](docs/getting-started/quickstart.md) — Step-by-step first-run tutorial to register, create your first to-do item, and explore AI features

### Guides

- 📋 [Usage Guide](docs/guides/usage.md) — End-user task management workflows including creating, editing, filtering, sorting, and completing to-do items
- 🔑 [Authentication Guide](docs/guides/authentication.md) — Auth0 account setup, login and logout flows, MFA configuration, and token lifecycle management
- 🤖 [AI Features Guide](docs/guides/ai-features.md) — AI-powered task suggestions, natural-language processing, and the three LangChain processing patterns
- 🐳 [Docker Development Guide](docs/guides/docker-development.md) — Docker Compose local development workflow, service management, hot-reload, and log inspection

## API Reference

Complete REST API documentation for all endpoints:

- [API Overview](docs/api-reference/overview.md) — API conventions, authentication requirements, error handling, pagination, and rate limiting
- [Todo Endpoints](docs/api-reference/todos.md) — Create, read, update, and delete to-do items (`/api/todos`)
- [User Endpoints](docs/api-reference/users.md) — User profile management (`/api/users`)
- [Auth Endpoints](docs/api-reference/auth.md) — Authentication flows including login, logout, and token refresh (`/api/auth`)
- [AI Endpoints](docs/api-reference/ai.md) — AI processing for simple queries, RAG, and multi-step agent workflows (`/api/ai`)

## Architecture

Understand the system design and technical decisions:

- [System Architecture](docs/architecture/overview.md) — Five-tier architecture overview with component diagrams, trust boundaries, and data flow paths
- [Data Model](docs/architecture/data-model.md) — MongoDB collection schemas, field definitions, indexing strategy, and entity-relationship diagrams
- [Security](docs/architecture/security.md) — Auth0 integration architecture, OAuth 2.0 / OIDC flows, JWT validation, encryption, and RBAC model

## Examples

Working code examples for integrating with the Todo Application API:

- [Python Client Examples](docs/examples/python-client.md) — Complete Python integration examples using `requests` and `httpx`
- [JavaScript Client Examples](docs/examples/javascript-client.md) — JavaScript and TypeScript integration examples using `fetch` and `axios`
- [cURL Examples](docs/examples/curl-examples.md) — Copy-paste ready cURL commands for every API endpoint

## Troubleshooting

Running into issues? The [Troubleshooting Guide](docs/troubleshooting.md) covers common setup problems, API error codes, database connection issues, Docker troubleshooting, and environment variable validation.

## Contributing

Contributions are welcome! Whether you are fixing a bug, adding a feature, improving documentation, or reporting an issue — every contribution makes this project better.

Please read the [Contributing Guide](CONTRIBUTING.md) for details on our development workflow, branch strategy, commit conventions, coding standards, and pull request process.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```text
MIT License

Copyright (c) 2026 Todo Application

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

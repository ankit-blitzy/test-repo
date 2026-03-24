# Todo Application Documentation

Welcome to the **Todo Application** documentation — your comprehensive guide to understanding, installing, configuring, and using the AI-powered to-do management platform.

> **Source:** Tech Spec Sections 1.1, 1.2, 2.2

## About the Todo Application

The Todo Application is a full-stack, AI-powered to-do management platform built with:

- **Python 3.13 / Flask 3.1.3** — Backend API server
- **React 19.2.1 / TypeScript 5.9.3** — Frontend web application
- **MongoDB 8.0** — Document database
- **Auth0** — Authentication and authorization (OAuth 2.0 / OIDC)
- **LangChain 1.2.10** — AI engine for natural-language processing

It combines traditional task management with natural-language processing capabilities — enabling smart categorization, AI-driven task suggestions, and a conversational interface for an enhanced productivity experience.

## Documentation Map

Use the navigation sidebar or the links below to explore the documentation.

### Getting Started

New to the Todo Application? Start here:

- **[Installation](getting-started/installation.md)** — Prerequisites, environment setup, and dependency installation for Docker and manual workflows
- **[Configuration](getting-started/configuration.md)** — Complete environment variable reference for the application, database, authentication, and AI services
- **[Quick Start](getting-started/quickstart.md)** — Step-by-step first-run tutorial to register, create your first to-do item, and explore AI features

### Guides

In-depth guides for specific features and workflows:

- **[Usage Guide](guides/usage.md)** — End-user task management workflows including creating, editing, filtering, sorting, and completing to-do items
- **[Authentication Guide](guides/authentication.md)** — Auth0 account setup, login and logout flows, MFA configuration, and token lifecycle management
- **[AI Features Guide](guides/ai-features.md)** — AI-powered task suggestions, natural-language processing, and the three LangChain processing patterns
- **[Docker Development Guide](guides/docker-development.md)** — Docker Compose local development workflow, service management, hot-reload, and log inspection

### API Reference

Complete REST API documentation for developers:

- **[API Overview](api-reference/overview.md)** — API conventions, authentication requirements, error handling, pagination, and rate limiting
- **[Todo Endpoints](api-reference/todos.md)** — Create, read, update, and delete to-do items (`/api/todos`)
- **[User Endpoints](api-reference/users.md)** — User profile management (`/api/users`)
- **[Auth Endpoints](api-reference/auth.md)** — Authentication flows including login, logout, and token refresh (`/api/auth`)
- **[AI Endpoints](api-reference/ai.md)** — AI processing for simple queries, RAG, and multi-step agent workflows (`/api/ai`)

### Architecture

Understand the system design and technical decisions:

- **[System Overview](architecture/overview.md)** — Five-tier architecture overview with component diagrams, trust boundaries, and data flow paths
- **[Data Model](architecture/data-model.md)** — MongoDB collection schemas, field definitions, indexing strategy, and entity-relationship diagrams
- **[Security](architecture/security.md)** — Auth0 integration architecture, OAuth 2.0 / OIDC flows, JWT validation, encryption, and RBAC model

### Examples

Working code examples for integrating with the API:

- **[Python Client](examples/python-client.md)** — Complete Python integration examples using `requests` and `httpx`
- **[JavaScript Client](examples/javascript-client.md)** — JavaScript and TypeScript integration examples using `fetch` and `axios`
- **[cURL Examples](examples/curl-examples.md)** — Copy-paste ready cURL commands for every API endpoint

### Support

- **[Troubleshooting](troubleshooting.md)** — Common setup problems, API error codes, database connection issues, Docker troubleshooting, and environment variable validation

## Quick Links

| I want to... | Go to... |
| --- | --- |
| Set up the application for the first time | [Installation Guide](getting-started/installation.md) |
| Configure environment variables | [Configuration Reference](getting-started/configuration.md) |
| Create my first to-do item | [Quick Start Tutorial](getting-started/quickstart.md) |
| Integrate with the REST API | [API Overview](api-reference/overview.md) |
| Understand the system architecture | [System Overview](architecture/overview.md) |
| Fix a setup issue | [Troubleshooting](troubleshooting.md) |

## Contributing

Contributions are welcome! See the [Contributing Guide](https://github.com/your-org/todo-app/blob/main/CONTRIBUTING.md) on GitHub for details on our development workflow, branch strategy, commit conventions, and pull request process.

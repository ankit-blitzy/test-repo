# To-Do List Application

> A modern, full-stack task management application built on the Blitzx platform — organize, track, and manage your tasks with priority levels, due dates, and powerful filtering.

The To-Do List Application is a web-based task management system designed to help users efficiently organize, prioritize, and track their tasks. Built on the Blitzx platform's service-oriented architecture, it provides an intuitive interface for creating, editing, and managing tasks with support for priority classification, deadline tracking, and dynamic filtering. The application leverages a React-powered frontend (U!) communicating through the archie-service-backend API gateway to a MongoDB data store, delivering a seamless and responsive task management experience.

*Source: Technical Specification §1.1*

---

## Key Features

The To-Do List Application provides a comprehensive set of task management capabilities:

- **Task Creation** — Create new tasks with a title, description, priority level, and due date for complete task definition
- **Task Editing** — Modify any property of an existing task including title, description, priority, and due date
- **Task Deletion** — Permanently remove tasks that are no longer needed with confirmation safeguards
- **Completion Tracking** — Mark tasks as complete or incomplete with visual indicators reflecting the current status
- **Priority Levels** — Categorize tasks by urgency using three levels: **High**, **Medium**, and **Low** with color-coded badges
- **Due Dates** — Assign deadlines to tasks with overdue indicators and date-based sorting for effective time management
- **Task Filtering** — Search and narrow displayed tasks by status, priority, due date range, and free-text search
- **Persistent Data Storage** — All task data is reliably persisted in MongoDB, ensuring data safety across sessions

---

## Technology Stack

The application is built on the Blitzx platform's prescribed technology stack:

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.x | UI library for the U! task management interface |
| **Frontend** | TypeScript | 5.7+ | Static type checking for frontend code |
| **Frontend** | TailwindCSS | 4.x | Utility-first CSS framework for responsive styling |
| **Frontend** | Vite | 6.x | Frontend build tool and development server |
| **Backend** | Python | 3.13.x | Backend runtime for Flask services |
| **Backend** | Flask | 3.1.x | Lightweight web framework for archie-service-backend |
| **Database** | MongoDB | 8.0.x | Document-oriented NoSQL database for task storage |
| **Database** | PyMongo | 4.16.x | Official MongoDB driver for Python data access |

*Source: Technical Specification §3.8*

---

## Quick Start

Get the To-Do List Application running locally in a few steps. For the complete setup guide with detailed instructions, see [Getting Started](docs/getting-started.md).

### Prerequisites

- Python 3.13.x
- Node.js (LTS version) and npm
- MongoDB 8.0.x (local installation or Docker)
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd task-list-app
```

```bash
# Backend setup
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

```bash
# Frontend setup
cd frontend && npm install
```

```bash
# Start MongoDB (Docker option)
docker run -d -p 27017:27017 --name task-mongo mongo:8.0
```

```bash
# Run the application
flask run          # Backend API server
npm run dev        # Frontend dev server (in frontend directory)
```

> **Note:** These are illustrative setup commands. Refer to [Getting Started](docs/getting-started.md) for the full guide including environment configuration and verification steps.

---

## Documentation

Comprehensive documentation for the To-Do List Application is organized in the `docs/` directory:

| Document | Description |
|----------|-------------|
| [Application Overview](docs/overview.md) | Purpose, value proposition, target users, and application scope |
| [Features](docs/features.md) | Complete feature catalog with descriptions and acceptance criteria |
| [UI Design](docs/ui-design.md) | User interface layout, components, interaction patterns, and responsive design |
| [System Requirements](docs/system-requirements.md) | Runtime prerequisites, browser compatibility, and environment configuration |
| [Core Functionality](docs/functionality.md) | Detailed reference for all task management operations and API patterns |
| [Technology Stack](docs/technology-stack.md) | Full technology stack with versions, justifications, and stack layer diagram |
| [Workflows](docs/workflow.md) | End-to-end user and system workflows with Mermaid sequence diagrams |
| [Architecture](docs/architecture.md) | System architecture within the Blitzx platform's five-layer design |
| [Data Model](docs/data-model.md) | MongoDB collection schema, ER diagram, indexing, and sample documents |
| [Getting Started](docs/getting-started.md) | Quick start guide for local setup, configuration, and verification |
| [Future Improvements](docs/future-improvements.md) | Planned enhancements and evolution roadmap |

---

## Contributing

Contribution guidelines for the To-Do List Application will be established as the project matures. In the meantime, please reach out to the project maintainers for information on how to contribute.

---

## License

License information for this project will be added in a future update. Please contact the project maintainers for licensing inquiries.

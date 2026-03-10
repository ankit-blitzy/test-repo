# Getting Started

This guide walks you through setting up and running the To-Do List Application on your local machine. By the end of this guide, you will have the backend API server, the frontend development server, and a MongoDB database instance running locally — ready for task management development and testing.

[← Back to README](../README.md)

---

## Prerequisites Checklist

Before setting up the To-Do List Application, ensure the following tools are installed on your system:

- [ ] **Python 3.13.x** — Backend runtime for the Flask-based archie-service-backend
- [ ] **Node.js (LTS version)** and **npm** — Required for building and running the React 19.x / TypeScript 5.7+ frontend
- [ ] **MongoDB 8.0.x** installed locally **OR** **Docker Engine** installed for running MongoDB as a container
- [ ] **Git** — Version control for cloning and managing the repository
- [ ] **A code editor** — [Visual Studio Code](https://code.visualstudio.com/) is recommended for its integrated terminal, Python/TypeScript extensions, and Markdown preview support

> **Tip:** For detailed version requirements, browser compatibility, and hardware recommendations, see the [System Requirements](system-requirements.md) document.

*Source: Technical Specification §3.1, §3.8*

---

## Clone the Repository

Start by cloning the To-Do List Application repository to your local machine and navigating into the project directory:

```bash
git clone <repository-url>
cd task-list-app
```

> **Note:** Replace `<repository-url>` with the actual Git URL for this project. The repository contains both the backend and frontend codebases in a monorepo structure.

---

## Backend Setup

The backend is powered by **Python 3.13.x** and **Flask 3.1.x**, serving as the archie-service-backend — the single entry point for all API requests from the U! frontend. The backend uses **PyMongo 4.16.x** for communication with MongoDB.

### Create a Virtual Environment

Create and activate a Python virtual environment to isolate backend dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
```

> **Windows users:** Use `venv\Scripts\activate` instead of `source venv/bin/activate`.

### Install Backend Dependencies

Install the required Python packages from the project's dependency manifest:

```bash
pip install -r requirements.txt
```

Key backend packages include:

| Package | Version | Purpose |
|---------|---------|---------|
| Flask | 3.1.x | Lightweight web framework for task management API endpoints |
| PyMongo | 4.16.x | Official MongoDB driver for Python data access |
| flask-pymongo | Latest stable | Flask integration for PyMongo connection management |
| python-dotenv | Latest stable | Environment variable loading from `.env` files |
| gunicorn | Latest stable | Production-grade WSGI server for Flask |

For the full technology breakdown, see the [Technology Stack](technology-stack.md) document.

*Source: Technical Specification §3.1, §3.2, §3.8*

---

## Frontend Setup

The frontend is the **U!** application — built with **React 19.x**, **TypeScript 5.7+**, **TailwindCSS 4.x**, and **Vite 6.x**. It provides the user interface for creating, editing, filtering, and managing tasks.

### Install Frontend Dependencies

Navigate to the frontend directory and install Node.js packages:

```bash
cd frontend
npm install
```

Key frontend packages include:

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.x | UI library for building the task management interface |
| TypeScript | 5.7+ | Static type checking for frontend code |
| TailwindCSS | 4.x | Utility-first CSS framework for responsive styling |
| Vite | 6.x | Build tool and development server with hot module replacement |

> **Note:** Ensure you are using a Node.js LTS version. You can check your version with `node --version`.

*Source: Technical Specification §3.2, §3.8*

---

## Database Setup

The To-Do List Application uses **MongoDB 8.0.x** as its document database. You can run MongoDB either through Docker (recommended) or as a local installation.

### Option A: Docker MongoDB (Recommended)

If you have Docker Engine installed, start a MongoDB 8.0 container with a single command:

```bash
docker run -d --name task-mongo -p 27017:27017 mongo:8.0
```

This starts a MongoDB 8.0 instance accessible at `localhost:27017`. The `-d` flag runs the container in the background, and `-p 27017:27017` maps the container's MongoDB port to your local machine.

To verify the container is running:

```bash
docker ps --filter name=task-mongo
```

### Option B: Local MongoDB Installation

If you prefer a system-wide MongoDB installation:

1. Download and install MongoDB 8.0.x from the [official MongoDB website](https://www.mongodb.com/try/download/community)
2. Follow the installation instructions for your operating system
3. Start the MongoDB service using your system's service manager (e.g., `mongod` or `systemctl start mongod`)

### Create the Database

Once MongoDB is running, the application will automatically create the `task_app` database and the required `tasks` collection on first use. No manual database initialization is required — PyMongo 4.16.x creates collections implicitly when the first document is inserted.

> **Tip:** You can verify MongoDB connectivity using the Mongo shell: `mongosh mongodb://localhost:27017/task_app`

*Source: Technical Specification §3.5, §6.2*

---

## Environment Configuration

The To-Do List Application uses environment variables to configure runtime behavior. Create a `.env` file in the project root to define these settings.

### Create the Environment File

Copy the example template or create a new `.env` file:

```bash
cp .env.example .env
```

### Configure Environment Variables

Open the `.env` file and set the following variables:

```env
DATABASE_URL=mongodb://localhost:27017/task_app
APP_PORT=5000
# See the full variable list in the table below
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `mongodb://localhost:27017/task_app` | MongoDB connection string for task data storage |
| `APP_PORT` | No | `5000` | Port for the Flask backend server (archie-service-backend) |
| `NODE_ENV` | No | `development` | Environment mode for the frontend (`development` or `production`) |
| `API_BASE_URL` | No | `http://localhost:5000/api` | Backend API base URL used by the U! frontend to send task requests |

> **Important:** Never commit `.env` files containing sensitive credentials to version control. Ensure `.env` is listed in your `.gitignore` file. For additional environment variables and production configuration details, refer to the [System Requirements](system-requirements.md) document.

*Source: Technical Specification §3.6.3*

---

## Running the Application

With all dependencies installed and the environment configured, start both the backend and frontend servers.

### Start the Backend Server

From the project root (with your virtual environment activated), launch the Flask development server:

```bash
flask run --port 5000
```

The archie-service-backend API will be available at: **<http://localhost:5000>**

> **Tip:** For development, Flask's built-in server provides auto-reload when you modify Python source files. For production, use Gunicorn: `gunicorn -w 4 app:app`

### Start the Frontend Development Server

In a separate terminal, navigate to the frontend directory and start the Vite development server:

```bash
cd frontend
npm run dev
```

The U! frontend application will be available at: **<http://localhost:5173>** (Vite's default port)

### Expected Running Services

Once both servers are started, you should have the following services running:

| Service | URL | Description |
|---------|-----|-------------|
| Backend API (archie-service-backend) | `http://localhost:5000` | Flask API server handling all task management requests |
| Frontend (U!) | `http://localhost:5173` | Vite development server serving the React application |
| MongoDB | `localhost:27017` | Database server storing task documents |

> **Note:** All task management requests from the U! frontend are routed through the archie-service-backend API gateway — this is the single entry point for all client-server communication (Constraint C-001).

*Source: Technical Specification §4.1, §5.1*

---

## Verifying the Setup

After starting all services, verify that each component is running correctly.

### Verify the Backend

Open a new terminal and send a test request to the backend API:

```bash
curl http://localhost:5000/api/health
```

A successful response confirms the Flask backend is running and able to process requests. You can also navigate to `http://localhost:5000` in your browser to verify the server is accessible.

### Verify the Frontend

Open your browser and navigate to:

```text
http://localhost:5173
```

You should see the To-Do List Application's task management interface rendered by the U! frontend. The page should load without errors, displaying the main task list view.

### Verify the Database Connection

Confirm that the backend can communicate with MongoDB by checking the application logs for a successful database connection message, or by running:

```bash
mongosh mongodb://localhost:27017/task_app --eval "db.stats()"
```

A successful response with database statistics confirms MongoDB is accessible.

### Quick Verification Checklist

- [ ] Backend API responds at `http://localhost:5000`
- [ ] Frontend loads at `http://localhost:5173`
- [ ] MongoDB is accepting connections on port `27017`
- [ ] Creating a task through the U! interface persists it in the database
- [ ] No error messages appear in the browser console or terminal logs

---

## Troubleshooting

If you encounter issues during setup, refer to the common problems and solutions below.

### Port Conflicts

**Symptom:** `Address already in use` error when starting the backend or frontend server.

**Solution:** Another process is using the required port. Identify and stop the conflicting process:

```bash
lsof -i :5000
kill -9 <PID>
```

Alternatively, change the port by setting `APP_PORT` in your `.env` file (backend) or using `npm run dev -- --port 3000` (frontend).

### MongoDB Connection Failure

**Symptom:** The backend cannot connect to MongoDB — errors such as `ServerSelectionTimeoutError` or `Connection refused`.

**Solution:**

1. Verify MongoDB is running: `docker ps --filter name=task-mongo` (Docker) or `mongosh` (local installation)
2. Check the `DATABASE_URL` in your `.env` file matches your MongoDB instance address
3. Ensure the MongoDB port (27017) is not blocked by a firewall
4. If using Docker, verify the container is running: `docker start task-mongo`

### Python Version Mismatch

**Symptom:** Import errors, syntax errors, or `ModuleNotFoundError` when running the backend.

**Solution:**

1. Verify your Python version: `python3 --version` — must be **3.13.x**
2. Ensure the virtual environment was created with the correct Python version
3. Recreate the virtual environment if necessary: `python3.13 -m venv venv`
4. Reinstall dependencies after recreating: `pip install -r requirements.txt`

### Node.js Version Mismatch

**Symptom:** Frontend build failures, npm install errors, or Vite startup issues.

**Solution:**

1. Verify your Node.js version: `node --version` — must be an LTS version
2. Use a Node version manager such as [nvm](https://github.com/nvm-sh/nvm) to install the correct version
3. Clear npm cache if needed: `npm cache clean --force`
4. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Virtual Environment Not Activated

**Symptom:** `command not found: flask` or dependencies are missing despite having run `pip install`.

**Solution:**

1. Ensure the virtual environment is activated: `source venv/bin/activate`
2. Your terminal prompt should show `(venv)` when the environment is active
3. On Windows, use: `venv\Scripts\activate`

### Frontend Cannot Reach Backend API

**Symptom:** Network errors in the browser console when the U! frontend attempts to create or fetch tasks.

**Solution:**

1. Verify the backend is running at the URL specified in `API_BASE_URL`
2. Check that `API_BASE_URL` in the `.env` file matches the actual backend address (default: `http://localhost:5000/api`)
3. Ensure CORS is properly configured in the Flask backend to allow requests from the frontend's origin

---

## Cross-References

For additional context and related documentation, refer to:

- **[System Requirements](system-requirements.md)** — Full runtime prerequisites, browser compatibility, environment variables, and hardware recommendations
- **[Technology Stack](technology-stack.md)** — Detailed technology descriptions, version justifications, and the stack layer diagram

---

*This document is part of the To-Do List Application documentation. Return to the [README](../README.md) for the full documentation index.*

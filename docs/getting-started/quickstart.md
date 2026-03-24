# Quick Start Tutorial

This tutorial walks you through your first interaction with the Todo Application — from starting services to creating, completing, and AI-assisting your first to-do item.

*Source: Tech Spec Sections 7.2 (UI Use Cases), 7.6 (Screens and User Interactions)*

> **Prerequisites:**
>
> - Installation completed — see the [Installation Guide](installation.md)
> - Configuration completed — see the [Configuration Reference](configuration.md)
> - All services running (backend, frontend, database)

**Estimated time:** This tutorial takes approximately 5–10 minutes to complete.

## Table of Contents

- [Step 1: Start the Services](#step-1-start-the-services)
- [Step 2: Access the Application](#step-2-access-the-application)
- [Step 3: Register an Account](#step-3-register-an-account)
- [Step 4: Create Your First To-Do](#step-4-create-your-first-to-do)
- [Step 5: Mark a To-Do as Complete](#step-5-mark-a-to-do-as-complete)
- [Step 6: Use the AI Assistant](#step-6-use-the-ai-assistant)
- [Next Steps](#next-steps)

---

## Step 1: Start the Services

The Todo Application consists of three services — a Flask backend, a React frontend, and a MongoDB database. You can start all three with a single command using Docker Compose (recommended) or start each service individually.

### Option A: Docker Compose (Recommended)

Run the following command from the project root directory:

```bash
# Start all services in detached mode
docker compose up -d
```

Expected output:

```text
[+] Running 3/3
 ✔ Container todo-mongodb  Started
 ✔ Container todo-flask    Started
 ✔ Container todo-react    Started
```

### Option B: Manual Start

If you installed services manually, open three separate terminal windows:

```bash
# Terminal 1: Start MongoDB
mongod --dbpath /path/to/data
```

```bash
# Terminal 2: Start the Flask backend
cd backend
source venv/bin/activate
flask run --host=0.0.0.0 --port=5000
```

```bash
# Terminal 3: Start the React frontend
cd frontend
npm run dev
```

### Verify Services Are Running

Confirm that all three services are up and responding:

```bash
# Check Docker Compose service status
docker compose ps

# Verify the backend health endpoint
curl http://localhost:5000/api/health
```

Expected health check response:

```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

> **Trouble?** If any service fails to start, see the [Troubleshooting Guide](../troubleshooting.md) for solutions to common startup issues such as port conflicts, missing dependencies, and database connection errors.

---

## Step 2: Access the Application

Open your web browser and navigate to the frontend URL:

```text
http://localhost:3000
```

You should see the Todo Application login page.

<!-- Screenshot: Login page -->

### Service URLs

The following table lists the default URLs for each service. If you changed ports in your `.env` file, substitute your configured values. See the [Configuration Reference](configuration.md) for all port settings.

| Service | URL | Description |
| --- | --- | --- |
| Frontend (React) | `http://localhost:3000` | Web application interface |
| Backend API (Flask) | `http://localhost:5000` | REST API server |
| MongoDB | `localhost:27017` | Database (no web UI by default) |

---

## Step 3: Register an Account

The Todo Application uses Auth0 for authentication. You will register an account through Auth0's Universal Login page.

### Using the Web Interface

1. Click the **"Sign Up"** button on the login page.
2. You will be redirected to the Auth0 authentication page.
3. Enter your email address and create a password that meets the strength requirements.
4. Complete any MFA (multi-factor authentication) setup if prompted. MFA is optional during local development.
5. After successful registration, Auth0 redirects you back to the application.

You are now logged in and should see the main application dashboard with an empty to-do list.

<!-- Screenshot: Auth0 sign-up page -->

<!-- Screenshot: Empty dashboard after first login -->

> **Note:** Registration uses Auth0's Universal Login page. Your Auth0 tenant must be properly configured with the correct callback URLs and allowed origins. See the [Authentication Guide](../guides/authentication.md) for detailed Auth0 setup instructions.

### API Alternative (for Developers)

If you prefer to authenticate programmatically, obtain an access token from Auth0 using the client credentials grant:

```bash
# Obtain an access token via Auth0
curl --request POST \
  --url https://YOUR_AUTH0_DOMAIN/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id": "YOUR_AUTH0_CLIENT_ID",
    "client_secret": "YOUR_AUTH0_CLIENT_SECRET",
    "audience": "YOUR_AUTH0_AUDIENCE",
    "grant_type": "client_credentials"
  }'
```

Expected response:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

Save the `access_token` value — you will include it as a Bearer token in the `Authorization` header for all subsequent API requests.

---

## Step 4: Create Your First To-Do

Now that you are logged in, create your first to-do item to verify that the full application stack is working.

### Using the Web Interface

1. Click the **"Add To-Do"** or **"+"** button on the dashboard.
2. Enter a title: `Buy groceries`
3. Optionally add a description: `Pick up milk, eggs, and bread from the store`
4. Optionally set a priority level — choose from **Low**, **Medium**, or **High**.
5. Optionally set a due date using the date picker.
6. Click **"Create"** to save the to-do item.

The new to-do item appears in your to-do list with the title, priority badge, and due date displayed.

<!-- Screenshot: Create to-do form -->

<!-- Screenshot: To-do list with first item -->

### API Alternative (for Developers)

Create a to-do item by sending a POST request to the todos endpoint:

```bash
# Create a new to-do item via API
curl --request POST \
  --url http://localhost:5000/api/todos \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "title": "Buy groceries",
    "description": "Pick up milk, eggs, and bread from the store",
    "priority": "medium",
    "due_date": "2026-02-01T00:00:00Z"
  }'
```

Expected response:

```json
{
  "id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "title": "Buy groceries",
  "description": "Pick up milk, eggs, and bread from the store",
  "completed": false,
  "priority": "medium",
  "due_date": "2026-02-01T00:00:00Z",
  "created_at": "2026-01-20T10:30:00Z",
  "updated_at": "2026-01-20T10:30:00Z"
}
```

The response confirms the item was created successfully. The `id` field is a unique MongoDB ObjectId that you will use in subsequent requests to read, update, or delete this item.

> **Learn more:** For the complete set of to-do CRUD operations — including listing, filtering, sorting, and bulk actions — see the [Usage Guide](../guides/usage.md) and the [Todo API Reference](../api-reference/todos.md).

---

## Step 5: Mark a To-Do as Complete

After creating a to-do item, mark it as complete to test the update workflow.

### Using the Web Interface

1. Find the **"Buy groceries"** to-do in your list.
2. Click the checkbox or **"Complete"** button next to the item.
3. The to-do item updates to show a visual completion indicator — strikethrough text and a check mark.

<!-- Screenshot: Completed to-do item -->

### API Alternative (for Developers)

Mark a to-do as complete by sending a PATCH request with the `completed` field set to `true`:

```bash
# Mark a to-do as complete via API
curl --request PATCH \
  --url http://localhost:5000/api/todos/65a1b2c3d4e5f6a7b8c9d0e1 \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "completed": true
  }'
```

Expected response:

```json
{
  "id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "title": "Buy groceries",
  "description": "Pick up milk, eggs, and bread from the store",
  "completed": true,
  "priority": "medium",
  "due_date": "2026-02-01T00:00:00Z",
  "created_at": "2026-01-20T10:30:00Z",
  "updated_at": "2026-01-20T11:00:00Z"
}
```

Notice that `completed` is now `true` and `updated_at` reflects the time of the change.

---

## Step 6: Use the AI Assistant

The Todo Application includes an AI-powered assistant built with LangChain 1.2.10 that helps you manage your to-do items through natural language. The assistant supports three processing patterns — simple queries, context-aware RAG analysis, and multi-step agent workflows.

### Using the Web Interface

1. Click the **"AI Assistant"** or chat icon in the application sidebar.
2. Type a natural language query in the chat input. Try one of these examples:
   - `"What should I prioritize today?"`
   - `"Create a to-do to schedule a dentist appointment next week"`
   - `"Summarize my pending tasks"`
3. Press **Enter** or click the send button.
4. The AI assistant processes your query and responds with suggestions, answers, or actions.

<!-- Screenshot: AI assistant chat interface -->

### Three AI Processing Patterns

The AI assistant automatically selects the best processing pattern for your query:

#### Simple Query — Direct Question Answering

Ask a straightforward question and receive a direct response.

**Example input:**

```text
How many to-do items do I have?
```

**Expected response:** The assistant returns a natural language count of your current to-do items, such as *"You have 1 to-do item, and it is marked as complete."*

#### RAG-Based Query — Context-Aware Responses

Ask a question that requires analyzing your existing to-do data. The assistant uses Retrieval-Augmented Generation (RAG) to ground its response in your actual items.

**Example input:**

```text
What should I work on next based on my deadlines?
```

**Expected response:** The assistant reviews your to-do items' due dates and priorities, then returns a prioritized recommendation such as *"Based on your deadlines, 'Buy groceries' (due Feb 1) should be your next focus."*

#### Multi-Step Agent — Complex Multi-Action Workflows

Request a complex action that involves creating or modifying multiple to-do items. The assistant breaks the request into steps and executes them sequentially.

**Example input:**

```text
Create a meal prep plan for the week as separate to-do items
```

**Expected response:** The assistant creates multiple to-do items — one for each day or meal — with appropriate titles, descriptions, and due dates. You will see the new items appear in your to-do list.

### API Alternative (for Developers)

Send an AI query programmatically using the simple query endpoint:

```bash
# Simple AI query via API
curl --request POST \
  --url http://localhost:5000/api/ai/query \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "What should I prioritize today?",
    "context": "todos"
  }'
```

Expected response:

```json
{
  "response": "Based on your current to-do items, I suggest prioritizing 'Buy groceries' as it has the nearest due date.",
  "processing_type": "simple",
  "tokens_used": 150
}
```

The `processing_type` field indicates which AI pattern was used, and `tokens_used` shows the LLM token consumption for the request.

> **Learn more:** For detailed documentation on all three AI processing patterns, advanced prompting strategies, and the RAG and agent API endpoints, see the [AI Features Guide](../guides/ai-features.md) and the [AI API Reference](../api-reference/ai.md).

---

## Next Steps

Congratulations! You have successfully started the Todo Application, registered an account, created your first to-do item, marked it as complete, and explored the AI assistant. You are ready to dive deeper into the application's capabilities.

Here is what to explore next:

- 📋 [Usage Guide](../guides/usage.md) — Learn all task management features including filtering, sorting, and bulk operations
- 🤖 [AI Features Guide](../guides/ai-features.md) — Explore advanced AI capabilities including RAG-based analysis and multi-step agent workflows
- 🔑 [Authentication Guide](../guides/authentication.md) — Set up MFA and manage user sessions
- 📡 [API Reference](../api-reference/overview.md) — Build integrations with the full REST API
- 🏗️ [Architecture Overview](../architecture/overview.md) — Understand the system design and component interactions
- 🐳 [Docker Development Guide](../guides/docker-development.md) — Advanced Docker workflows including log inspection and hot-reload
- 🔧 [Troubleshooting](../troubleshooting.md) — Solutions for common issues and error codes

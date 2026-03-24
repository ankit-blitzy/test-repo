# AI Features Guide

This guide explains the AI-powered features of the Todo Application, including natural language processing, smart categorization, and conversational task management powered by LangChain.

**Target audience:** Users who want to leverage AI features to enhance their productivity, and developers who want to understand the AI processing architecture and integrate with AI endpoints.

## Prerequisites

Before using AI features, ensure the following:

- **Todo Application installed and running** — see the [Installation Guide](../getting-started/installation.md)
- **LLM API key configured** — see the [Configuration Reference](../getting-started/configuration.md#aillm-configuration)
- **User account with authentication set up** — see the [Authentication Guide](authentication.md)

## Table of Contents

- [AI Capabilities Overview](#ai-capabilities-overview)
- [AI Processing Pipeline](#ai-processing-pipeline)
- [Simple Query Processing](#simple-query-processing)
- [RAG-Based Document Analysis](#rag-based-document-analysis)
- [Multi-Step Agent Workflows](#multi-step-agent-workflows)
- [Natural Language Task Creation](#natural-language-task-creation)
- [Smart Categorization](#smart-categorization)
- [Task Prioritization Suggestions](#task-prioritization-suggestions)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Limitations and Best Practices](#limitations-and-best-practices)

---

## AI Capabilities Overview

The Todo Application integrates LangChain 1.2.10 to provide three distinct AI processing patterns that enhance task management:

1. **Simple Query Processing** — Direct LLM interactions for quick questions and task suggestions
2. **RAG-Based Document Analysis** — Retrieval-Augmented Generation for context-aware responses using stored documents and task history
3. **Multi-Step Agent Workflows** — Autonomous task planning and execution using LangChain agents with tool access

### Feature Highlights

- 🤖 **Natural language to-do creation** — Create items from conversational input
- 🏷️ **Automatic task categorization** — AI-suggested tags and categories
- ⭐ **Intelligent priority suggestions** — Content-based priority analysis
- 💬 **Conversational interface** — Chat-based task management
- 📊 **RAG-powered recommendations** — Context-aware task suggestions from your history
- 🔄 **Multi-step workflows** — Complex task planning and breakdown

AI features are powered by LangChain 1.2.10 with LangChain-Core 1.2.14, connecting to your configured LLM provider (OpenAI, Anthropic, or Azure).

*Source: Tech Spec Section 4.5 — LangChain Processing Patterns*

---

## AI Processing Pipeline

The AI processing engine routes incoming queries through a classification pipeline that determines the optimal processing pattern for each request. The following diagram illustrates the complete processing flow.

```mermaid
flowchart LR
    A[User Query] --> B{Query Classifier}
    B -->|Simple Question| C[Simple Query Processor]
    B -->|Document/Context Needed| D[RAG Processor]
    B -->|Complex/Multi-Step| E[Agent Processor]

    C --> F[LLM Provider]
    D --> G[Vector Store\nRetrieval]
    G --> H[Context\nAugmentation]
    H --> F
    E --> I[Tool Selection]
    I --> J[Action Execution]
    J --> K{Task Complete?}
    K -->|No| I
    K -->|Yes| F

    F --> L[Response\nGeneration]
    L --> M[User Response]

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#e8f5e9
    style E fill:#e8f5e9
    style F fill:#f3e5f5
    style M fill:#e1f5fe
```

### Pipeline Flow Explanation

1. **User Query** — The user submits a natural language query through the UI or the [AI API endpoints](../api-reference/ai.md).
2. **Query Classifier** — LangChain analyzes the query and routes it based on complexity and intent. Simple factual questions go to the Simple Query Processor; questions requiring existing data go to the RAG Processor; complex multi-step requests go to the Agent Processor.
3. **Processing Path** — The query is processed through one of three patterns, each optimized for different workloads:
   - **Simple Query Processor** sends the query directly to the LLM.
   - **RAG Processor** retrieves relevant documents from the vector store, augments the query with context, then sends the combined prompt to the LLM.
   - **Agent Processor** iteratively selects tools, executes actions, and observes results until the task is complete.
4. **LLM Provider** — The configured LLM (OpenAI GPT-4, Anthropic Claude, or Azure OpenAI) generates the response.
5. **Response Generation** — Raw LLM output is formatted, enriched with metadata (token usage, processing time, sources), and returned to the user.

*Source: Tech Spec Section 4.5 — LangChain Processing Pipeline; Section 6.1 — AI Processing Service*

---

## Simple Query Processing

Simple query processing provides direct interactions with the LLM for straightforward questions, quick suggestions, and basic task assistance. This is the fastest AI processing pattern with typical response times of 1–3 seconds.

### Use Cases

- **Task suggestions:** "What should I work on today?"
- **Description generation:** "Write a description for a task about updating the user interface"
- **Organization advice:** "What's a good way to organize my tasks by project?"
- **Title refinement:** "Make this task title more concise: Update the dashboard component to include analytics"

### How It Works

1. The query is classified as "simple" by the classifier — no document retrieval or multi-step actions are needed.
2. The query is sent directly to the LLM with a system prompt optimized for task management.
3. The LLM generates a response.
4. The response is returned to the user with processing metadata.

### API Example

```bash
curl -X POST "http://localhost:5000/api/ai/query" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Suggest 5 tasks I should add for a website redesign project",
    "context": {
      "include_history": false
    }
  }'
```

### Response Example

```json
{
  "response": "Here are 5 tasks for your website redesign project:\n1. Audit current website performance and content\n2. Create wireframes for new layout\n3. Design responsive mockups for mobile and desktop\n4. Implement new frontend components\n5. Conduct user testing and gather feedback",
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 1250,
    "tokens_used": {
      "prompt": 85,
      "completion": 71,
      "total": 156
    },
    "processing_pattern": "simple"
  }
}
```

For the full API specification including all request parameters and status codes, see the [AI API Endpoints](../api-reference/ai.md#simple-query).

*Source: Tech Spec Section 4.5 — Simple Query Pattern*

---

## RAG-Based Document Analysis

Retrieval-Augmented Generation (RAG) combines document retrieval from the vector store with LLM generation to provide context-aware responses based on your existing to-do items and stored documents. This pattern is ideal when the answer depends on your personal data. Typical response times are 2–5 seconds.

### Use Cases

- "What tasks are related to my marketing project?"
- "Summarize what I've been working on this week"
- "Find tasks that are similar to 'update API documentation'"
- "Based on my completed tasks, what should I focus on next?"

### How It Works

1. The query is classified as requiring context from stored data.
2. Relevant documents and to-do items are retrieved from the MongoDB vector store using embedding similarity search.
3. Retrieved context is augmented with the user's query into a combined prompt.
4. The augmented prompt is sent to the LLM.
5. The LLM generates a context-aware response.
6. The response is returned with source citations linking back to the matched items.

> **Vector Store:** The application uses MongoDB's vector search capabilities with the `embeddings` collection (vector-indexed) to store and retrieve document embeddings. Documents are embedded using the configured LLM provider's embedding model.

### API Example

```bash
curl -X POST "http://localhost:5000/api/ai/rag" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What tasks are related to my marketing campaign?",
    "top_k": 5
  }'
```

### Response Example

```json
{
  "response": "Based on your existing tasks, here are items related to your marketing campaign:\n1. 'Create social media content calendar' (due: 2026-04-15)\n2. 'Design email newsletter template' (due: 2026-04-10)\n3. 'Write blog post about product launch' (completed)\n\nI recommend prioritizing the email newsletter template since it has the earliest due date.",
  "sources": [
    {"id": "507f1f77bcf86cd799439011", "title": "Create social media content calendar", "relevance_score": 0.92},
    {"id": "507f1f77bcf86cd799439012", "title": "Design email newsletter template", "relevance_score": 0.87},
    {"id": "507f1f77bcf86cd799439013", "title": "Write blog post about product launch", "relevance_score": 0.81}
  ],
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 2100,
    "tokens_used": {
      "prompt": 210,
      "completion": 132,
      "total": 342
    },
    "processing_pattern": "rag",
    "documents_retrieved": 3
  }
}
```

For the full API specification including all request parameters, filter options, and status codes, see the [AI API Endpoints](../api-reference/ai.md#rag-query).

*Source: Tech Spec Section 4.5 — RAG Pattern; Section 6.2 — Embeddings Collection (Vector-Indexed)*

---

## Multi-Step Agent Workflows

Multi-step agent workflows represent the most powerful AI pattern. LangChain agents can autonomously plan, execute, and iterate on complex tasks using available tools. This pattern handles requests that require multiple actions and decisions. Typical response times are 5–30 seconds depending on complexity.

### Use Cases

- "Create a project plan for launching a new product with milestones and subtasks"
- "Reorganize all my incomplete tasks by priority and suggest a weekly schedule"
- "Analyze my task completion patterns and suggest productivity improvements"
- "Break down 'Build a REST API' into specific development tasks"

### How It Works

1. The query is classified as requiring multi-step processing.
2. A LangChain agent is initialized with available tools:
   - **Todo Tool** — Create, read, update, and delete to-do items
   - **Search Tool** — Search existing to-do items and documents
   - **Analysis Tool** — Analyze task patterns, statistics, and completion trends
3. The agent creates an execution plan.
4. The agent iteratively selects tools, executes actions, and observes results.
5. The agent determines when the task is complete.
6. The final response is compiled and returned to the user.

### API Example

```bash
curl -X POST "http://localhost:5000/api/ai/agent" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Break down the task \"Build user authentication\" into subtasks and create them",
    "context": {
      "allow_mutations": true
    }
  }'
```

### Response Example

```json
{
  "response": "I've broken down 'Build user authentication' into 6 subtasks and created them in your task list:\n1. ✅ Set up Auth0 tenant and application (Priority: High)\n2. ✅ Implement login/logout API endpoints (Priority: High)\n3. ✅ Add JWT token validation middleware (Priority: High)\n4. ✅ Create React login/logout components (Priority: Medium)\n5. ✅ Implement token refresh mechanism (Priority: Medium)\n6. ✅ Add role-based access control (Priority: Low)",
  "steps": [
    {"step": 1, "action": "analyze", "description": "Analyzed 'Build user authentication' and identified 6 subtasks", "status": "completed"},
    {"step": 2, "action": "create_todo", "description": "Created subtask: Set up Auth0 tenant and application", "status": "completed"},
    {"step": 3, "action": "create_todo", "description": "Created subtask: Implement login/logout API endpoints", "status": "completed"},
    {"step": 4, "action": "create_todo", "description": "Created subtask: Add JWT token validation middleware", "status": "completed"},
    {"step": 5, "action": "create_todo", "description": "Created subtask: Create React login/logout components", "status": "completed"},
    {"step": 6, "action": "create_todo", "description": "Created subtask: Implement token refresh mechanism", "status": "completed"},
    {"step": 7, "action": "create_todo", "description": "Created subtask: Add role-based access control", "status": "completed"},
    {"step": 8, "action": "generate_schedule", "description": "Compiled final summary of created subtasks", "status": "completed"}
  ],
  "mutations": [
    {"action": "create", "resource": "todo", "id": "507f1f77bcf86cd799439020", "title": "Set up Auth0 tenant and application"},
    {"action": "create", "resource": "todo", "id": "507f1f77bcf86cd799439021", "title": "Implement login/logout API endpoints"},
    {"action": "create", "resource": "todo", "id": "507f1f77bcf86cd799439022", "title": "Add JWT token validation middleware"},
    {"action": "create", "resource": "todo", "id": "507f1f77bcf86cd799439023", "title": "Create React login/logout components"},
    {"action": "create", "resource": "todo", "id": "507f1f77bcf86cd799439024", "title": "Implement token refresh mechanism"},
    {"action": "create", "resource": "todo", "id": "507f1f77bcf86cd799439025", "title": "Add role-based access control"}
  ],
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 8500,
    "tokens_used": {
      "prompt": 520,
      "completion": 725,
      "total": 1245
    },
    "processing_pattern": "agent",
    "steps_executed": 8,
    "steps_limit": 5
  }
}
```

> **⚠️ Warning:** When `allow_mutations` is `true`, the agent can create, update, or delete to-do items on your behalf.
> Review the agent's mutations in the response to verify they match your expectations.
> Set `allow_mutations` to `false` (the default) if you only want planning suggestions without modifications to your task list.

For the full API specification including all request parameters and status codes, see the [AI API Endpoints](../api-reference/ai.md#agent-query).

*Source: Tech Spec Section 4.5 — Multi-Step Agent Pattern*

---

## Natural Language Task Creation

Create to-do items using natural language instead of filling out forms. The AI parses your input and automatically extracts task attributes such as title, description, priority, due date, and tags.

### How It Works

When you submit a natural language description, the AI:

1. Analyzes the text for task-related keywords and phrases.
2. Extracts the core task title from the input.
3. Identifies priority indicators (e.g., "urgent", "maybe", "important").
4. Parses date and time references (e.g., "tomorrow", "by Friday", "next week").
5. Detects contextual tags from keywords (e.g., "meeting", "code review", "design").
6. Creates the to-do item with all extracted attributes.

### Examples

| Natural Language Input | Extracted Task |
| --- | --- |
| "Remind me to buy groceries tomorrow" | Title: "Buy groceries", Due: Tomorrow, Priority: Medium |
| "Urgent: Fix the login bug by Friday" | Title: "Fix the login bug", Due: Friday, Priority: High |
| "Maybe read that book about Python sometime" | Title: "Read Python book", Priority: Low |
| "Meeting with design team at 3pm about dashboard redesign" | Title: "Meeting with design team - dashboard redesign", Due: Today 3pm, Tags: [meeting, design] |

### API Example

```bash
curl -X POST "http://localhost:5000/api/ai/query" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Create a task: Review pull requests for the authentication module by end of day, high priority",
    "action": "create_todo"
  }'
```

### Response Example

```json
{
  "response": "Created a new to-do item: 'Review pull requests for the authentication module'",
  "todo_created": {
    "id": "todo_abc123",
    "title": "Review pull requests for the authentication module",
    "priority": "high",
    "due_date": "2026-03-24T23:59:59Z",
    "tags": ["code-review", "authentication"]
  }
}
```

---

## Smart Categorization

The AI automatically suggests categories and tags for your to-do items based on their content, helping you keep your task list organized without manual effort.

### How It Works

1. When you create a new to-do item, the AI analyzes the title and description.
2. It suggests relevant tags based on content similarity with your existing tasks.
3. It identifies project associations based on keyword and context matching.
4. Suggestions appear as optional tags you can accept or dismiss.

### Example

- **Task:** "Update API documentation for the auth endpoints"
- **AI-suggested tags:** `documentation`, `api`, `authentication`
- **AI-suggested category:** "Backend Development"

Smart categorization runs automatically when enabled. You can disable it in your user settings or through the application configuration.

*Source: Tech Spec Section 4.5 — AI Processing Capabilities*

---

## Task Prioritization Suggestions

The AI analyzes your task list and suggests optimal priority assignments and work order, helping you focus on what matters most.

### Features

- Analyzes task due dates, dependencies, and estimated effort
- Considers your completion history and work patterns
- Suggests re-prioritization when new high-priority items are added
- Identifies tasks at risk of missing their deadline

### API Example

```bash
curl -X POST "http://localhost:5000/api/ai/query" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Analyze my tasks and suggest what I should prioritize today"
  }'
```

### Response Example

```json
{
  "response": "Based on your current task list, here's my prioritization suggestion for today:\n\n🔴 **High Priority:**\n1. 'Fix authentication bug' — Due today, marked urgent\n2. 'Submit quarterly report' — Due tomorrow\n\n🟡 **Medium Priority:**\n3. 'Review design mockups' — Due in 3 days, blocking other tasks\n\n🟢 **Can Wait:**\n4. 'Update README' — Due next week\n5. 'Research new testing framework' — No due date",
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 2800,
    "tokens_used": {
      "prompt": 320,
      "completion": 185,
      "total": 505
    },
    "processing_pattern": "rag",
    "documents_retrieved": 5
  }
}
```

---

## Configuration

AI features require an LLM provider to be configured. The following environment variables control AI behavior.

### AI Environment Variables

| Variable | Description | Example | Required |
| --- | --- | --- | --- |
| `LLM_PROVIDER` | LLM provider name | `openai`, `anthropic`, `azure` | Yes |
| `LLM_API_KEY` | Provider API key | `sk-...` (OpenAI), `sk-ant-...` (Anthropic) | Yes |
| `LLM_MODEL` | Model identifier | `gpt-4`, `claude-3-sonnet`, `gpt-4o` | No (default: `gpt-4`) |
| `LANGCHAIN_TRACING_V2` | Enable LangSmith tracing | `true` / `false` | No |

### Provider Setup

**OpenAI:**

1. Sign up at [platform.openai.com](https://platform.openai.com).
2. Create an API key in the API Keys section of the dashboard.
3. Set `LLM_PROVIDER=openai` and `LLM_API_KEY=sk-YOUR_OPENAI_API_KEY` in your `.env` file.

**Anthropic:**

1. Sign up at [console.anthropic.com](https://console.anthropic.com).
2. Create an API key in the dashboard.
3. Set `LLM_PROVIDER=anthropic` and `LLM_API_KEY=sk-ant-YOUR_ANTHROPIC_API_KEY` in your `.env` file.

**Azure OpenAI:**

1. Configure an Azure OpenAI Service resource in the [Azure Portal](https://portal.azure.com).
2. Create a model deployment and note the endpoint URL and deployment name.
3. Set `LLM_PROVIDER=azure`, `LLM_API_KEY=YOUR_AZURE_OPENAI_KEY`, and configure `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_DEPLOYMENT` in your `.env` file.

> **⚠️ Security Warning:** Never commit API keys to version control. Always use environment variables or a secrets manager.

For the complete configuration reference including all environment variables, see the [Configuration Guide](../getting-started/configuration.md#aillm-configuration).

*Source: Tech Spec Section 6.1 — Core Services Architecture*

---

## Usage Examples

### Example 1: Conversational Task Management

Ask the AI to help you prepare for an upcoming event:

**User:** "I need to prepare for the team meeting next Monday"

**AI Response:** Creates tasks such as:

- "Prepare meeting agenda" (Priority: High, Due: Friday)
- "Review last meeting notes" (Priority: Medium, Due: Thursday)
- "Send calendar invite to team" (Priority: High, Due: Today)

### Example 2: Task Analysis

Ask the AI to analyze your progress:

**User:** "Am I on track with my project tasks?"

**AI Response:** Analyzes your completion rate, identifies overdue items, and highlights upcoming deadlines with actionable recommendations.

### Example 3: Quick Task Creation

Create a to-do item with a single sentence:

**User:** "Add 'Deploy v2.0 to staging' as high priority due Friday"

**AI Response:** Creates the to-do item with title "Deploy v2.0 to staging", priority set to high, and due date set to the upcoming Friday.

### cURL Example

```bash
curl -X POST "http://localhost:5000/api/ai/query" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Suggest 3 tasks for improving code quality"
  }'
```

### Python Example

```python
import requests

BASE_URL = "http://localhost:5000"
TOKEN = "YOUR_ACCESS_TOKEN"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Simple query — ask for task suggestions
response = requests.post(
    f"{BASE_URL}/api/ai/query",
    headers=headers,
    json={"query": "Suggest 3 tasks for improving code quality"}
)
data = response.json()
print(f"AI Response: {data['response']}")

# RAG query — find related tasks
rag_response = requests.post(
    f"{BASE_URL}/api/ai/rag",
    headers=headers,
    json={
        "query": "What tasks are related to my frontend project?",
        "top_k": 5
    }
)
rag_data = rag_response.json()
print(f"Related tasks: {rag_data['response']}")
for source in rag_data.get("sources", []):
    print(f"  - {source['title']} (relevance: {source['relevance_score']})")
```

---

## Limitations and Best Practices

### Limitations

- **LLM dependency:** AI response quality depends on the capability of the configured LLM. More capable models (e.g., GPT-4) produce better results than smaller models.
- **Processing time varies:** Simple queries take approximately 1–2 seconds, RAG queries take 2–3 seconds, and agent workflows take 5–10 seconds or more for complex tasks.
- **Token usage and cost:** Each AI request consumes LLM tokens. Complex agent workflows use significantly more tokens than simple queries. Monitor usage if you are on a pay-per-use LLM plan.
- **Review AI-generated content:** AI suggestions should always be reviewed before accepting, especially for agent-created to-do items that modify your task list.
- **Conversation history TTL:** Conversation history stored in the `conversations` collection has a time-to-live (TTL) index. Older context may expire and become unavailable for follow-up queries.

### Best Practices

- **Be specific in your queries** — Detailed, clear queries produce better results than vague requests.
- **Start with simple queries** — Use the simple query pattern first; escalate to RAG or agent workflows only when needed.
- **Review AI-created tasks** — Always verify that agent-created to-do items match your expectations before marking them as final.
- **Monitor token usage** — Check the `tokens_used` field in API responses to track consumption and manage costs.
- **Use RAG for context-dependent questions** — When you need answers based on your existing tasks or documents, use the RAG endpoint for more accurate, grounded responses.
- **Set `allow_mutations` carefully** — Only enable `allow_mutations: true` in agent requests when you want the AI to modify your task list directly.

### Next Steps

- **Full API reference:** [AI API Endpoints](../api-reference/ai.md)
- **System architecture:** [Architecture Overview](../architecture/overview.md)
- **Task management basics:** [Usage Guide](usage.md)
- **API conventions:** [API Overview](../api-reference/overview.md)

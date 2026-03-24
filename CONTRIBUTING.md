# Contributing to Todo Application

Thank you for your interest in contributing to the Todo Application! Every contribution — whether it is a bug fix, a new feature, improved documentation, or a helpful issue report — makes this project better for everyone. We appreciate the time and effort you invest in helping this project grow.

This guide walks you through the process of contributing, from setting up your environment to submitting a pull request. Whether you are fixing a typo or building a major feature, these guidelines ensure a smooth and consistent workflow for all contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
  - [Branch Strategy](#branch-strategy)
  - [Commit Conventions](#commit-conventions)
  - [Development Steps](#development-steps)
- [Pull Request Process](#pull-request-process)
  - [Creating a Pull Request](#creating-a-pull-request)
  - [Code Review Guidelines](#code-review-guidelines)
  - [Merge Requirements](#merge-requirements)
- [Coding Standards](#coding-standards)
  - [Python and Backend Standards](#python-and-backend-standards)
  - [TypeScript and Frontend Standards](#typescript-and-frontend-standards)
  - [Documentation Standards](#documentation-standards)
- [Testing Requirements](#testing-requirements)
  - [Backend Testing](#backend-testing)
  - [Frontend Testing](#frontend-testing)
  - [Documentation Testing](#documentation-testing)
- [Reporting Issues](#reporting-issues)
- [Getting Help](#getting-help)

## Code of Conduct

This project is committed to providing a welcoming, inclusive, and harassment-free experience for everyone. All contributors are expected to uphold the following standards:

- **Be respectful** — Treat all community members with courtesy and professionalism, regardless of experience level, background, or identity.
- **Be constructive** — Provide helpful, actionable feedback in code reviews and issue discussions. Focus on the work, not the person.
- **Be collaborative** — Share knowledge openly, help newcomers get started, and work together toward shared goals.
- **Be inclusive** — Use welcoming and inclusive language. Ensure that discussions and decisions consider diverse perspectives.

Unacceptable behavior includes harassment, discriminatory language, personal attacks, and any conduct that creates a hostile environment. If you experience or witness unacceptable behavior, please report it to the project maintainers.

## Getting Started

Before contributing, set up your local development environment:

1. **Review the prerequisites** — Ensure you have the required tools installed. See the [Installation Guide](docs/getting-started/installation.md) for detailed instructions on setting up Python 3.13, Node.js, MongoDB 8.0, and Docker.

2. **Configure your environment** — Set up the necessary environment variables for the database, authentication, and AI services. See the [Configuration Reference](docs/getting-started/configuration.md) for the complete list of environment variables and their descriptions.

3. **Fork and clone the repository:**

    ```bash
    # Fork the repository on GitHub, then clone your fork
    git clone https://github.com/YOUR_USERNAME/todo-app.git
    cd todo-app
    ```

4. **Create a feature branch** from `develop` (see [Branch Strategy](#branch-strategy) below).

5. **Make your changes**, commit them following our [Commit Conventions](#commit-conventions), and submit a pull request.

## Development Workflow

This section describes the branching strategy, commit conventions, and step-by-step development process used by the Todo Application project.

<!-- Source: Tech Spec Section 4.3 (development lifecycle) -->

### Branch Strategy

The project follows a structured branching model to maintain code quality and release stability:

| Branch Pattern | Purpose | Base Branch | Example |
| --- | --- | --- | --- |
| `main` | Production-ready, stable releases | — | `main` |
| `develop` | Integration branch for in-progress features | `main` | `develop` |
| `feature/<name>` | New feature development | `develop` | `feature/todo-filters` |
| `bugfix/<name>` | Bug fixes for reported issues | `develop` | `bugfix/duplicate-todo-fix` |
| `docs/<name>` | Documentation updates and additions | `develop` | `docs/api-reference-update` |
| `hotfix/<name>` | Critical production fixes | `main` | `hotfix/auth-token-expiry` |

**Branch naming rules:**

- Use lowercase letters, numbers, and hyphens only
- Keep branch names short but descriptive
- Prefix with the appropriate category (`feature/`, `bugfix/`, `docs/`, `hotfix/`)
- Reference the issue number when applicable (e.g., `feature/42-todo-filters`)

### Commit Conventions

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```text
type(scope): description

[optional body]

[optional footer(s)]
```

**Commit types:**

| Type | Description | Example |
| --- | --- | --- |
| `feat` | A new feature or capability | `feat(api): add todo CRUD endpoints` |
| `fix` | A bug fix | `fix(auth): resolve token refresh loop` |
| `docs` | Documentation changes only | `docs(readme): update installation instructions` |
| `style` | Code formatting, no logic changes | `style(frontend): apply prettier formatting` |
| `refactor` | Code restructuring, no behavior change | `refactor(services): extract validation logic` |
| `test` | Adding or updating tests | `test(api): add todo endpoint integration tests` |
| `chore` | Build process, tooling, or dependency updates | `chore(deps): update Flask to 3.1.3` |
| `ci` | CI/CD pipeline changes | `ci(github): add lint check to PR workflow` |

**Scope examples:** `api`, `frontend`, `auth`, `ai`, `db`, `docker`, `config`, `docs`

**Commit message rules:**

- Use the imperative mood in the description (e.g., "add" not "added" or "adds")
- Keep the first line under 72 characters
- Do not end the description with a period
- Reference related issues in the footer (e.g., `Closes #42`)

### Development Steps

Follow these steps for every contribution:

1. **Fork and clone** the repository (if you have not already):

    ```bash
    git clone https://github.com/YOUR_USERNAME/todo-app.git
    cd todo-app
    git remote add upstream https://github.com/ORIGINAL_ORG/todo-app.git
    ```

2. **Sync your fork** with the latest upstream changes:

    ```bash
    git checkout develop
    git fetch upstream
    git merge upstream/develop
    ```

3. **Create a new branch** from `develop`:

    ```bash
    git checkout -b feature/your-feature-name develop
    ```

4. **Make your changes** with descriptive, conventional commits:

    ```bash
    git add .
    git commit -m "feat(api): add pagination to todo list endpoint"
    ```

5. **Write or update tests** for any code changes (see [Testing Requirements](#testing-requirements)).

6. **Update documentation** for any API, feature, or configuration changes.

7. **Run the full validation suite** before pushing:

    ```bash
    # Backend tests
    python -m pytest -v --tb=short

    # Frontend tests
    cd frontend && npm test -- --watchAll=false --ci

    # Documentation validation
    mkdocs build --strict
    markdownlint docs/**/*.md README.md CONTRIBUTING.md
    ```

8. **Push your branch** and open a pull request:

    ```bash
    git push origin feature/your-feature-name
    ```

## Pull Request Process

### Creating a Pull Request

When opening a pull request, provide the following information:

- **Title** — Use the conventional commit format (e.g., `feat(api): add todo filtering endpoint`)
- **Description** — Explain what changed and why. Include:
  - A summary of the changes and their motivation
  - Links to related issues (e.g., `Closes #42`, `Relates to #38`)
  - Screenshots or screen recordings for any UI changes
  - Notes on any breaking changes or migration steps

**Pull request checklist** (include in every PR description):

```markdown
## Checklist

- [ ] Code follows the project's coding standards
- [ ] All existing tests pass (`pytest` / `npm test`)
- [ ] New tests added for new functionality
- [ ] Documentation updated (if applicable)
- [ ] Linting passes (`flake8`, `eslint`, `markdownlint`)
- [ ] Type checking passes (`mypy`, `tsc --noEmit`)
- [ ] No hardcoded credentials or sensitive values
- [ ] Commit messages follow conventional commits format
```

### Code Review Guidelines

All pull requests require code review before merging:

- **At least one approving review** is required from a project maintainer or designated reviewer
- **Address all review comments** — Resolve every comment before requesting re-review. If you disagree with a suggestion, explain your reasoning in the comment thread
- **Keep pull requests focused** — Each PR should address a single concern (one feature, one bug fix, or one documentation update). Large PRs are harder to review and more likely to introduce issues
- **Respond promptly** — Aim to address review feedback within 48 hours to keep the review cycle efficient
- **Squash commits** before merging — Combine related commits into a single, descriptive commit that follows the conventional commits format

### Merge Requirements

A pull request may be merged only when all of the following conditions are met:

- All CI/CD pipeline checks pass (linting, type checking, tests, build)
- At least one code review approval from a maintainer
- No unresolved merge conflicts with the target branch
- Documentation is updated for any user-facing or API changes
- No regressions in existing test coverage

## Coding Standards

Consistent coding standards ensure readability, maintainability, and quality across the entire codebase. The following standards apply to all contributions.

<!-- Source: Tech Spec Section 6.6 (coding standards) -->

### Python and Backend Standards

The backend is built with Python 3.13 and Flask 3.1.3. All Python code must adhere to the following standards:

- **Style guide** — Follow [PEP 8](https://peps.python.org/pep-0008/) for all Python code
- **Code formatting** — Use `black` with default settings for automatic code formatting
- **Linting** — Use `flake8` to catch style violations and potential errors
- **Type checking** — Use `mypy` in strict mode. All function signatures must include type hints:

```python
def create_todo(title: str, description: str | None = None) -> dict:
    """Create a new to-do item and persist it to the database.

    Args:
        title: The title of the to-do item. Must not be empty.
        description: An optional description providing additional detail.

    Returns:
        A dictionary representing the newly created to-do item.

    Raises:
        ValueError: If the title is empty or exceeds 200 characters.
    """
    if not title or len(title) > 200:
        raise ValueError("Title must be between 1 and 200 characters")
    # Implementation continues...
```

- **Docstrings** — All public functions, classes, and methods must have Google-style docstrings
- **Flask routes** — Follow RESTful conventions with proper HTTP methods, status codes, and JSON responses
- **Imports** — Group imports in the standard order: standard library, third-party packages, local modules. Use `isort` for automatic sorting

**Run backend checks:**

```bash
# Format code
black src/

# Lint
flake8 src/ tests/

# Type check
mypy src/ --strict

# Sort imports
isort src/ tests/
```

### TypeScript and Frontend Standards

The frontend is built with React 19.2.1 and TypeScript 5.9.3. All frontend code must adhere to the following standards:

- **TypeScript strict mode** — Enable strict mode in `tsconfig.json`. All variables, parameters, and return types must be explicitly typed
- **Linting** — Follow the project ESLint configuration. Run `eslint` before committing
- **Formatting** — Use `prettier` for consistent code formatting
- **React components** — Use functional components with hooks. Do not use class components:

```typescript
interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, onToggle }) => {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="h-5 w-5 rounded border-gray-300"
      />
      <span className={completed ? "line-through text-gray-400" : "text-gray-900"}>
        {title}
      </span>
    </div>
  );
};
```

- **Styling** — Use TailwindCSS utility classes exclusively. Do not use inline styles, CSS modules, or styled-components
- **State management** — Use React built-in state management (useState, useReducer, useContext) unless project-level state libraries are explicitly adopted

**Run frontend checks:**

```bash
cd frontend

# Lint
npx eslint src/ --ext .ts,.tsx

# Type check
npx tsc --noEmit

# Format
npx prettier --check src/
```

### Documentation Standards

All documentation files must follow these standards to maintain consistency and quality:

- **Markdown linting** — All `.md` files must pass `markdownlint` validation using the project [`.markdownlint.yml`](.markdownlint.yml) configuration
- **Heading hierarchy** — Use proper heading levels without skipping: `#` for document title, `##` for major sections, `###` for subsections, `####` for detail blocks
- **Code blocks** — All fenced code blocks must specify a language identifier (e.g., `python`, `typescript`, `bash`, `json`, `yaml`, `mermaid`)
- **Internal links** — Use relative paths from the document location (e.g., `[Installation Guide](docs/getting-started/installation.md)`)
- **Terminology** — Use consistent terms throughout:
  - `todo` in code contexts (variable names, API paths, JSON keys)
  - "to-do" in prose (sentences and descriptions)
  - "item" in user-facing language
- **No hardcoded secrets** — All examples must use clearly labeled placeholder values (e.g., `YOUR_AUTH0_DOMAIN`, `YOUR_API_KEY`)

**Run documentation checks:**

```bash
# Validate documentation build
mkdocs build --strict

# Lint Markdown files
markdownlint docs/**/*.md README.md CONTRIBUTING.md
```

## Testing Requirements

All code contributions must include appropriate tests. The project maintains high test coverage to ensure reliability and prevent regressions.

### Backend Testing

- **Test runner** — Use `pytest` for all backend tests
- **Unit tests** — Write unit tests for all service methods (`TodoService`, `UserService`, `AuthService`, `AIService`)
- **Integration tests** — Write integration tests for all API endpoints to verify request handling, response formats, and status codes
- **Test organization** — Place tests in the `tests/` directory, mirroring the source structure:

```text
tests/
├── unit/
│   ├── test_todo_service.py
│   ├── test_user_service.py
│   ├── test_auth_service.py
│   └── test_ai_service.py
├── integration/
│   ├── test_todo_endpoints.py
│   ├── test_user_endpoints.py
│   ├── test_auth_endpoints.py
│   └── test_ai_endpoints.py
└── conftest.py
```

- **Coverage** — Aim for a minimum of 80% code coverage. Critical paths (authentication, data persistence) should have 90%+ coverage

**Run backend tests:**

```bash
# Run all tests with verbose output
python -m pytest -v --tb=short

# Run with coverage report
python -m pytest --cov=src --cov-report=term-missing

# Run a specific test file
python -m pytest tests/unit/test_todo_service.py -v
```

### Frontend Testing

- **Test runner** — Use `vitest` (preferred) or `jest` for all frontend tests
- **Component tests** — Write component tests using React Testing Library to verify rendering, user interactions, and accessibility
- **Integration tests** — Write integration tests for complete user workflows (e.g., creating a to-do item, marking it complete, deleting it)
- **Coverage** — Aim for a minimum of 80% code coverage for components and hooks

**Run frontend tests:**

```bash
cd frontend

# Run all tests
npm test -- --watchAll=false --ci

# Run with coverage
npm test -- --watchAll=false --ci --coverage

# Run a specific test file
npm test -- --watchAll=false TodoItem.test.tsx
```

### Documentation Testing

- **MkDocs build** — Run `mkdocs build --strict` to verify that the documentation builds without warnings. The `--strict` flag causes the build to fail on broken links, missing navigation entries, and invalid Markdown syntax
- **Markdown linting** — Run `markdownlint` on all documentation files to enforce consistent formatting
- **Link validation** — All internal links must resolve to existing files in the repository

**Run documentation tests:**

```bash
# Build documentation with strict mode
mkdocs build --strict

# Lint all Markdown files
markdownlint docs/**/*.md README.md CONTRIBUTING.md

# Check for broken links in build output
mkdocs build --strict 2>&1 | grep -i "warning"
```

## Reporting Issues

Use GitHub Issues to report bugs, request features, or ask questions. Well-written issues help maintainers understand and address your concern quickly.

### Bug Reports

When reporting a bug, include the following information:

- **Title** — A clear, concise summary of the issue
- **Environment** — Operating system, Python version, Node.js version, browser (if applicable)
- **Steps to reproduce** — A numbered list of steps to reliably reproduce the issue
- **Expected behavior** — What you expected to happen
- **Actual behavior** — What actually happened, including any error messages or stack traces
- **Screenshots** — Include screenshots or screen recordings for UI-related issues
- **Labels** — Tag the issue with `bug` and any relevant component labels (e.g., `api`, `frontend`, `auth`)

### Feature Requests

When requesting a new feature, include:

- **Title** — A concise description of the desired feature
- **Use case** — Explain the problem you are trying to solve and why the feature would be valuable
- **Proposed solution** — Describe your ideal solution, including any API changes, UI mockups, or workflow diagrams
- **Alternatives considered** — List any workarounds or alternative approaches you have explored
- **Labels** — Tag the issue with `enhancement` and any relevant component labels

### Documentation Issues

For documentation improvements, include:

- **Title** — Identify the document and the nature of the issue (e.g., "Incorrect API example in todos.md")
- **Location** — Link to the specific document and section
- **Description** — Explain what is incorrect, unclear, or missing
- **Labels** — Tag the issue with `documentation`

## Getting Help

If you need assistance, explore these resources before opening an issue:

- **Documentation** — Browse the full documentation at the links in the [README](README.md)
- **Troubleshooting** — Check the [Troubleshooting Guide](docs/troubleshooting.md) for solutions to common setup and runtime issues
- **Existing issues** — Search [GitHub Issues](https://github.com/ORIGINAL_ORG/todo-app/issues) to see if your question has already been answered
- **Discussions** — Use GitHub Discussions for general questions, ideas, and community conversation

If none of these resources address your concern, open a new issue with the `question` label and provide as much context as possible.

---

*Thank you for contributing to the Todo Application! Your efforts help make this project better for developers and users everywhere.*

# diffwise

> AI-powered PR diff explainer for developer teams.

diffwise analyzes a Git diff and generates structured, human-readable output —
PR descriptions, pedagogical explanations for juniors, or risk-focused reviews.
Built for teams who want clarity and consistency in their code review process.

## Features

- 🔍 Parse any `.diff` file or stdin input
- 🧠 AI-generated output via Anthropic Claude API
- 🎛️ Three modes: `description` | `explain` | `review`
- 🖥️ CLI-first, with a Vue 3 web UI in Phase 2
- 🔗 Bitbucket API integration in Phase 3

## Stack

- **Runtime:** Node.js 20+ / TypeScript 5.x
- **CLI:** citty
- **UI:** Vue 3 + Vite + Pinia *(Phase 2)*
- **Backend:** Hono *(Phase 2)*
- **AI:** Anthropic SDK (`claude-sonnet-4-20250514`)
- **Tests:** Vitest
- **Monorepo:** npm workspaces

## Usage (Phase 1 — CLI)

```bash
# From file
diffwise --file my.diff --mode description

# From stdin
git diff main | diffwise --mode review

# Modes
--mode description   → PR title + Markdown body
--mode explain       → Pedagogical breakdown for juniors
--mode review        → Summary + identified risks
```

## Project Structure

```
diffwise/
├── packages/
│   ├── core/          # Diff parser + AI prompt engine (shared)
│   ├── cli/           # Phase 1 — citty CLI
│   ├── api/           # Phase 2 — Hono backend
│   └── ui/            # Phase 2 — Vue 3 frontend
├── specs/
│   ├── CONSTITUTION.md
│   ├── SPEC.md
│   └── ARCHITECTURE.md
├── .github/
│   └── copilot-instructions.md
└── README.md
```

See `specs/ARCHITECTURE.md` for full module breakdown.
See `specs/SPEC.md` for functional specification.
See `specs/CONSTITUTION.md` for project rules and conventions.

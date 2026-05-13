# diffwise — Architecture

## Monorepo Structure

```
diffwise/
├── package.json                      # Racine — workspaces config
├── tsconfig.base.json                # Config TS partagée
├── eslint.config.js
├── prettier.config.js
├── vitest.config.ts
├── .env.example
├── .gitignore
├── README.md
├── CLAUDE.md                         # Contexte projet pour Claude
├── specs/
│   ├── CONSTITUTION.md               # Règles non-négociables (SDD)
│   ├── SPEC.md                       # Spécification fonctionnelle
│   └── ARCHITECTURE.md               # Ce fichier
├── .github/
│   └── copilot-instructions.md
└── packages/
    ├── core/                         # Moteur partagé
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts              # Exports publics
    │       ├── diff-parser.ts
    │       ├── diff-parser.spec.ts
    │       ├── prompt-builder.ts
    │       ├── prompt-builder.spec.ts
    │       ├── ai-client.ts
    │       ├── output-formatter.ts
    │       └── prompts/
    │           └── index.ts          # Prompts système versionnés
    └── cli/                          # Phase 1 — citty CLI
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── index.ts              # Entrée CLI + flags
            └── runner.ts             # Orchestrateur pipeline
```

> Packages `api` et `ui` seront ajoutés en Phase 2.

---

## Module Breakdown

### `packages/core`

| Module               | Responsibility                                               |
|----------------------|--------------------------------------------------------------|
| `diff-parser`        | Parse unified diff → structured object (files, hunks, stats) |
| `prompt-builder`     | Build Anthropic prompt from parsed diff + mode               |
| `ai-client`          | Anthropic SDK wrapper, handles chunking                      |
| `output-formatter`   | Format AI response to final Markdown string                  |

### `packages/cli`

| Module       | Responsibility                           |
|--------------|------------------------------------------|
| `index.ts`   | CLI entry, flags parsing via citty       |
| `runner.ts`  | Orchestrates core pipeline               |

### `packages/api` *(Phase 2)*

| Module          | Responsibility                        |
|-----------------|---------------------------------------|
| `routes/diff`   | POST /analyze — receives diff + mode  |
| `middleware`    | Error handling, request validation    |

### `packages/ui` *(Phase 2)*

| Module               | Responsibility                           |
|----------------------|------------------------------------------|
| `DiffInput.vue`      | Paste zone with syntax highlight         |
| `ModeSelector.vue`   | Tab/toggle for the 3 modes               |
| `OutputPanel.vue`    | Live Markdown rendered output            |
| `stores/diff.ts`     | Pinia store — diff state + history       |

---

## Data Flow (Phase 1 — CLI)

```
stdin / .diff file
      │
      ▼
 diff-parser        → DiffDocument { files[], stats }
      │
      ▼
 prompt-builder     → AnthropicMessage { system, user }
      │
      ▼
 ai-client          → raw Markdown string
      │
      ▼
 output-formatter   → final Markdown (stdout / file)
```

---

## Data Flow (Phase 2 — Web UI)

```
UI paste (raw diff)
      │
      ▼
 POST /analyze (Hono)
      │
      ▼
  [same core pipeline]
      │
      ▼
 JSON response → OutputPanel.vue (rendered Markdown)
```

---

## Data Flow (Phase 3 — Bitbucket)

```
Bitbucket PR id
      │
      ▼
 bitbucket-client   → raw diff text
      │
      ▼
  [same core pipeline]
      │
      ▼
 bitbucket-client   → PATCH /pullrequests/{id} (description)
```

---

## Token Budget Strategy

- Diffs are split by file
- Each file hunk is estimated (~4 chars/token)
- If total > 6000 tokens → chunked analysis → merged summary
- Model: `claude-sonnet-4-20250514`, `max_tokens: 1500` per call

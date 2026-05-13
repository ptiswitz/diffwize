# diffwise — Architecture

## Monorepo Structure

```
diffwise/
├── packages/
│   ├── core/          # Diff parser + AI prompt engine (shared)
│   ├── cli/           # Phase 1 — citty CLI
│   ├── api/           # Phase 2 — Hono backend
│   └── ui/            # Phase 2 — Vue 3 frontend
├── specs/
│   ├── CONSTITUTION.md    # Règles non-négociables du projet (SDD)
│   ├── SPEC.md            # Spécification fonctionnelle
│   └── ARCHITECTURE.md    # Ce fichier
├── .github/
│   └── copilot-instructions.md
└── README.md
```

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

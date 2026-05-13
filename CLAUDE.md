# diffwise — Claude Context

> Read this file before generating or modifying any code in this project.
> Then read `specs/CONSTITUTION.md` for rules and conventions.

---

## What is diffwise

diffwise is a personal dev tooling project built by a Senior Frontend Developer
and Tech Lead. It analyzes Git diffs and generates structured AI-powered output
in three modes: PR description, junior-friendly explanation, and risk review.

---

## Current Phase

**Phase 1 — CLI** (active)

The focus is on `packages/core` and `packages/cli` only.
Do not generate code for `packages/api` or `packages/ui` unless explicitly asked.

---

## Key Rules (summary — full rules in specs/CONSTITUTION.md)

- TypeScript strict mode — no `any`, no `!`, no `as unknown`
- Kebab-case filenames, PascalCase types, camelCase functions
- One function = one responsibility
- No inline prompts — all prompts live in `packages/core/src/prompts/`
- Errors are typed — no `catch (e: any)`
- Conventional Commits only (`feat:`, `fix:`, `chore:`, `docs:`)

---

## Stack

- Node.js 20+ / TypeScript 5.x
- citty (CLI)
- Anthropic SDK — `claude-sonnet-4-20250514`
- Vitest (tests)
- npm workspaces (monorepo)

---

## What to always do

- Check `specs/SPEC.md` for input/output contracts before touching core modules
- Check `specs/ARCHITECTURE.md` for module responsibilities before creating files
- Colocate test files: `src/diff-parser.spec.ts` next to `src/diff-parser.ts`
- Keep `packages/cli` and `packages/core` strictly separated

---

## What to never do

- Add dependencies not listed in the Constitution without asking
- Generate Phase 2 or Phase 3 code unless the user explicitly says so
- Use `console.log` — use consola
- Commit secrets or hardcode API keys

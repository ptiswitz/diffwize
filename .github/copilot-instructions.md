# diffwise — GitHub Copilot Instructions

> Read specs/CONSTITUTION.md before suggesting any code.

## Project

diffwise is a Node.js + TypeScript monorepo (npm workspaces).
Current active packages: `packages/core`, `packages/cli`.
Do not suggest code for `packages/api` or `packages/ui` unless asked.

## TypeScript

- Strict mode — no `any`, no `!`, no `as unknown`
- Prefer `type` over `interface` unless the type needs to be extended
- All async functions must have explicit return types
- Typed errors only — no `catch (e: any)`

## Naming

- Files: `kebab-case`
- Types / Classes: `PascalCase`
- Functions / Variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Vue components: `PascalCase.vue` *(Phase 2)*

## Architecture

- `packages/core` — all shared logic (parser, prompt builder, AI client)
- `packages/cli` — CLI only, no business logic
- Never import between `cli`, `api`, `ui` directly
- All prompts live in `packages/core/src/prompts/` — never inline

## Tests

- Vitest — colocate test files: `src/foo.spec.ts` next to `src/foo.ts`
- Test coverage required for all `packages/core` modules

## Commits

- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`
- One PR = one feature or fix

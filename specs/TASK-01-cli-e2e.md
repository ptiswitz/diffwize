# TASK-01 — CLI End-to-End Pipeline

## Context

Read the following files before doing anything:

- `CLAUDE.md`
- `specs/CONSTITUTION.md`
- `specs/SPEC.md`
- `specs/ARCHITECTURE.md`
- `packages/core/src/index.ts`
- `packages/core/src/diff-parser.ts`
- `packages/core/src/prompt-builder.ts`
- `packages/core/src/ai-client.ts`
- `packages/core/src/output-formatter.ts`
- `packages/core/src/prompts/index.ts`
- `packages/cli/src/index.ts`
- `packages/cli/src/runner.ts`

## Objective

Build and validate the complete CLI pipeline end-to-end.
A user should be able to pipe a real `.diff` file into `diffwise`
and get a structured Markdown output in all three modes.

## Tasks

1. Create a realistic fixture file at `packages/cli/fixtures/sample.diff`
   — a unified diff of 2-3 TypeScript files with additions, deletions, and a rename
2. Build all packages (`npm run build`)
3. Verify the CLI runs correctly for all three modes using the fixture:
   - `--mode description`
   - `--mode explain`
   - `--mode review`
4. Add a root-level `dev:cli` script to `package.json` for convenience:
   ```
   node --env-file=.env packages/cli/dist/index.js
   ```
5. Verify all 9 existing tests still pass after the build

## Constraints

- Do not modify any existing `packages/core` source files
- Do not add any new dependencies
- The fixture diff must be realistic — actual TypeScript patterns, not placeholder text
- Follow all naming and coding conventions in `specs/CONSTITUTION.md`
- Use `consola` for any logging — no `console.log`

## Success Criteria

- `npm run build` completes with no TypeScript errors
- All 3 modes produce a non-empty structured Markdown output
- `npm test` still reports 9/9 passing
- `packages/cli/fixtures/sample.diff` is committed

## Expected Commit

```
feat: working end-to-end CLI pipeline (all 3 modes)
```

## List your questions first.

Do not write any code until you have listed your questions and I have answered them.
Then announce your plan step by step before starting.
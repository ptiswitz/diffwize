# TASK-02 — Phase 1 Validation

## Context

Read the following files before doing anything:

- `CLAUDE.md`
- `specs/CONSTITUTION.md`
- `specs/SPEC.md`
- `specs/ARCHITECTURE.md`
- `packages/cli/src/index.ts`
- `packages/cli/src/runner.ts`
- `packages/core/src/output-formatter.ts`
- `packages/cli/fixtures/sample.diff`

## Objective

Validate and complete all Phase 1 CLI features declared in `specs/SPEC.md`.
Three features have not been verified yet: `stdin` input, `--output` file writing,
and `--stats` token usage display. Code quality gates must also pass.

## Tasks

### 1 — Verify stdin support
Test that the CLI correctly reads a diff piped from stdin:
```bash
cat packages/cli/fixtures/sample.diff | node --env-file=.env packages/cli/dist/index.js --mode description
```
If it fails, fix `packages/cli/src/runner.ts` accordingly.

### 2 — Verify --output flag
Test that `--output` writes the Markdown result to a file:
```bash
node --env-file=.env packages/cli/dist/index.js --file packages/cli/fixtures/sample.diff --mode review --output /tmp/diffwise-out.md
cat /tmp/diffwise-out.md
```
If it fails, fix `packages/cli/src/runner.ts` accordingly.

### 3 — Verify --stats flag
Test that `--stats` appends token usage as a Markdown comment at the top of the output:
```bash
node --env-file=.env packages/cli/dist/index.js --file packages/cli/fixtures/sample.diff --mode description --stats
```
Confirm output starts with `<!-- diffwise ·`.
If it fails, fix `packages/core/src/output-formatter.ts` accordingly.

### 4 — Run lint
```bash
npm run lint
```
Fix all errors. Do not suppress rules — fix the actual code.

### 5 — Run format check
```bash
npm run format:check
```
If it fails, run `npm run format` and commit the result.

### 6 — Run full test suite
```bash
npm test
```
All 9 tests must pass. If any fix from steps 1–3 affects tested modules,
add or update tests accordingly.

## Constraints

- Follow all conventions in `specs/CONSTITUTION.md`
- Use `consola` for all logging — no `console.log`
- Do not add new dependencies
- Do not modify `packages/core/src/diff-parser.ts` or `packages/core/src/prompt-builder.ts`

## Success Criteria

- `stdin` mode produces non-empty Markdown output
- `--output` writes a valid Markdown file to the specified path
- `--stats` output starts with `<!-- diffwise ·`
- `npm run lint` exits with 0 errors
- `npm run format:check` exits clean
- `npm test` reports 9+ tests passing

## Expected Commits

```
fix: verify and complete stdin, --output, and --stats CLI features
chore: fix lint and formatting
```

## List your questions first.

Do not write any code until you have listed your questions and I have answered them.
Then announce your plan step by step before starting.
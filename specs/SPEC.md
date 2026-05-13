# diffwise — Functional Specification

## Vision

diffwise reduces the cognitive overhead of writing and reviewing pull requests.
It transforms raw Git diffs into structured, actionable content using AI —
serving three distinct use cases depending on the user's intent.

---

## Use Cases

### UC-01 — Generate a PR Description

**Actor:** Developer opening a PR
**Input:** Git diff (file or stdin)
**Output:** Markdown document with:
- A concise PR title (imperative, ≤72 chars)
- A "What changed" section (bullet list per file/module)
- A "Why" section (inferred intent)
- A "How to test" section (inferred from changed logic)

---

### UC-02 — Explain changes to a junior

**Actor:** Tech lead, senior dev, or junior themselves
**Input:** Git diff
**Output:** Plain-language explanation:
- What each changed file does in the codebase
- What the diff modifies and why it matters
- Any patterns or concepts worth noting (e.g. "this introduces a composable")

---

### UC-03 — Review for risks

**Actor:** Tech lead doing a pre-review
**Input:** Git diff
**Output:** Structured risk report:
- Summary of changes (1 paragraph)
- List of flagged concerns: logic changes, missing tests, API surface changes,
  potential regressions
- Severity tags: `[low]` `[medium]` `[high]`

---

## Input Contract

| Source     | Format            | Phase |
|------------|-------------------|-------|
| stdin      | unified diff text | 1     |
| --file     | .diff file path   | 1     |
| UI paste   | raw diff text     | 2     |
| Bitbucket  | PR id + repo slug | 3     |

---

## Output Contract

All outputs are Markdown strings.

- **CLI:** printed to stdout (with optional `--output` flag to write to file)
- **UI:** rendered in a live preview panel
- **Bitbucket:** pushed to PR description field via REST API

---

## Mode Reference

| Mode          | Flag                  | Output shape                          |
|---------------|-----------------------|---------------------------------------|
| `description` | `--mode description`  | PR title + structured Markdown body   |
| `explain`     | `--mode explain`      | Plain-language pedagogical breakdown  |
| `review`      | `--mode review`       | Summary + risk list with severity tags|

---

## Constraints & Non-Goals

- No authentication in Phase 1
- No persistent storage in Phase 1
- Diffs > ~800 lines will be chunked (token budget management)
- No support for binary file diffs
- Not a replacement for human code review

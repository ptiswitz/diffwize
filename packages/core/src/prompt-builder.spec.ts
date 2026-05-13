import { describe, it, expect } from 'vitest'
import { buildPrompt } from './prompt-builder.js'
import { parseDiff } from './diff-parser.js'

const SAMPLE_DIFF = `diff --git a/src/foo.ts b/src/foo.ts
index 1234567..abcdefg 100644
--- a/src/foo.ts
+++ b/src/foo.ts
@@ -1,3 +1,4 @@
 export function foo() {
-  return 'old'
+  return 'new'
 }
`

describe('buildPrompt', () => {
  it('returns a system and user message', () => {
    const doc = parseDiff(SAMPLE_DIFF)
    const prompt = buildPrompt(doc, 'description')

    expect(prompt.system).toBeTruthy()
    expect(prompt.user).toBeTruthy()
  })

  it('includes file path in user message', () => {
    const doc = parseDiff(SAMPLE_DIFF)
    const prompt = buildPrompt(doc, 'description')

    expect(prompt.user).toContain('src/foo.ts')
  })

  it('uses the correct system prompt per mode', () => {
    const doc = parseDiff(SAMPLE_DIFF)

    const description = buildPrompt(doc, 'description')
    const explain = buildPrompt(doc, 'explain')
    const review = buildPrompt(doc, 'review')

    expect(description.system).not.toBe(explain.system)
    expect(explain.system).not.toBe(review.system)
    expect(description.system).not.toBe(review.system)
  })

  it('includes diff stats in user message', () => {
    const doc = parseDiff(SAMPLE_DIFF)
    const prompt = buildPrompt(doc, 'review')

    expect(prompt.user).toContain('Files changed')
  })
})

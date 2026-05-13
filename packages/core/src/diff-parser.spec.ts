import { describe, it, expect } from 'vitest'
import { parseDiff } from './diff-parser.js'

const SIMPLE_DIFF = `diff --git a/src/foo.ts b/src/foo.ts
index 1234567..abcdefg 100644
--- a/src/foo.ts
+++ b/src/foo.ts
@@ -1,4 +1,5 @@
 export function foo() {
-  return 'old'
+  return 'new'
+  // updated
 }
`

const NEW_FILE_DIFF = `diff --git a/src/bar.ts b/src/bar.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/bar.ts
@@ -0,0 +1,3 @@
+export function bar() {
+  return 'bar'
+}
`

const DELETED_FILE_DIFF = `diff --git a/src/old.ts b/src/old.ts
deleted file mode 100644
index 1234567..0000000
--- a/src/old.ts
+++ /dev/null
@@ -1,3 +0,0 @@
-export function old() {
-  return 'old'
-}
`

describe('parseDiff', () => {
  it('parses a simple modified file', () => {
    const doc = parseDiff(SIMPLE_DIFF)

    expect(doc.files).toHaveLength(1)
    expect(doc.files[0]?.path).toBe('src/foo.ts')
    expect(doc.files[0]?.status).toBe('modified')
    expect(doc.files[0]?.additions).toBe(2)
    expect(doc.files[0]?.deletions).toBe(1)
    expect(doc.totalAdditions).toBe(2)
    expect(doc.totalDeletions).toBe(1)
  })

  it('detects a new file', () => {
    const doc = parseDiff(NEW_FILE_DIFF)

    expect(doc.files[0]?.status).toBe('added')
    expect(doc.files[0]?.additions).toBe(3)
    expect(doc.files[0]?.deletions).toBe(0)
  })

  it('detects a deleted file', () => {
    const doc = parseDiff(DELETED_FILE_DIFF)

    expect(doc.files[0]?.status).toBe('deleted')
    expect(doc.files[0]?.deletions).toBe(3)
    expect(doc.files[0]?.additions).toBe(0)
  })

  it('returns empty files array for empty diff', () => {
    const doc = parseDiff('')
    expect(doc.files).toHaveLength(0)
    expect(doc.totalAdditions).toBe(0)
    expect(doc.totalDeletions).toBe(0)
  })

  it('parses hunks correctly', () => {
    const doc = parseDiff(SIMPLE_DIFF)
    expect(doc.files[0]?.hunks).toHaveLength(1)
    expect(doc.files[0]?.hunks[0]?.header).toContain('@@')
  })
})

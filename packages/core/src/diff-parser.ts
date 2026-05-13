export type DiffHunk = {
  header: string
  lines: string[]
  additions: number
  deletions: number
}

export type DiffFile = {
  path: string
  oldPath: string | null
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  hunks: DiffHunk[]
  additions: number
  deletions: number
}

export type DiffDocument = {
  files: DiffFile[]
  totalAdditions: number
  totalDeletions: number
  rawText: string
}

const FILE_HEADER_RE = /^diff --git a\/(.+) b\/(.+)$/
const HUNK_HEADER_RE = /^@@.+@@/
const NEW_FILE_RE = /^new file mode/
const DELETED_FILE_RE = /^deleted file mode/
const RENAME_FROM_RE = /^rename from (.+)$/
const RENAME_TO_RE = /^rename to (.+)$/

export function parseDiff(rawDiff: string): DiffDocument {
  const lines = rawDiff.split('\n')
  const files: DiffFile[] = []

  let currentFile: DiffFile | null = null
  let currentHunk: DiffHunk | null = null
  let renameFrom: string | null = null

  for (const line of lines) {
    const fileMatch = FILE_HEADER_RE.exec(line)

    if (fileMatch) {
      if (currentHunk && currentFile) currentFile.hunks.push(currentHunk)
      if (currentFile) files.push(currentFile)

      currentFile = {
        path: fileMatch[2] ?? fileMatch[1] ?? '',
        oldPath: null,
        status: 'modified',
        hunks: [],
        additions: 0,
        deletions: 0,
      }
      currentHunk = null
      renameFrom = null
      continue
    }

    if (!currentFile) continue

    if (NEW_FILE_RE.test(line)) {
      currentFile.status = 'added'
      continue
    }

    if (DELETED_FILE_RE.test(line)) {
      currentFile.status = 'deleted'
      continue
    }

    const renameFromMatch = RENAME_FROM_RE.exec(line)
    if (renameFromMatch) {
      renameFrom = renameFromMatch[1] ?? null
      currentFile.status = 'renamed'
      continue
    }

    const renameToMatch = RENAME_TO_RE.exec(line)
    if (renameToMatch && renameFrom) {
      currentFile.oldPath = renameFrom
      currentFile.path = renameToMatch[1] ?? currentFile.path
      continue
    }

    if (HUNK_HEADER_RE.test(line)) {
      if (currentHunk) currentFile.hunks.push(currentHunk)
      currentHunk = { header: line, lines: [], additions: 0, deletions: 0 }
      continue
    }

    if (currentHunk) {
      currentHunk.lines.push(line)
      if (line.startsWith('+') && !line.startsWith('+++')) {
        currentHunk.additions++
        currentFile.additions++
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        currentHunk.deletions++
        currentFile.deletions++
      }
    }
  }

  if (currentHunk && currentFile) currentFile.hunks.push(currentHunk)
  if (currentFile) files.push(currentFile)

  return {
    files,
    totalAdditions: files.reduce((sum, f) => sum + f.additions, 0),
    totalDeletions: files.reduce((sum, f) => sum + f.deletions, 0),
    rawText: rawDiff,
  }
}

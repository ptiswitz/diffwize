export { parseDiff } from './diff-parser.js'
export { buildPrompt } from './prompt-builder.js'
export { analyze } from './ai-client.js'
export { formatOutput } from './output-formatter.js'

export type { DiffDocument, DiffFile, DiffHunk } from './diff-parser.js'
export type { AnalyzeMode, AnalyzeOptions, AnalyzeResult } from './ai-client.js'

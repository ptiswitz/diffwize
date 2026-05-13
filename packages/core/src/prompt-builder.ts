import type { DiffDocument } from './diff-parser.js'
import type { AnalyzeMode } from './ai-client.js'
import { DESCRIPTION_PROMPT, EXPLAIN_PROMPT, REVIEW_PROMPT } from './prompts/index.js'

const CHARS_PER_TOKEN = 4
const MAX_TOKENS = 6000

export type AnthropicMessage = {
  system: string
  user: string
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

function selectSystemPrompt(mode: AnalyzeMode): string {
  switch (mode) {
    case 'description':
      return DESCRIPTION_PROMPT
    case 'explain':
      return EXPLAIN_PROMPT
    case 'review':
      return REVIEW_PROMPT
  }
}

function buildDiffSummary(doc: DiffDocument): string {
  const fileList = doc.files
    .map((f) => {
      const status = f.status !== 'modified' ? ` (${f.status})` : ''
      return `- ${f.path}${status}: +${f.additions} -${f.deletions}`
    })
    .join('\n')

  return `Files changed: ${doc.files.length} | +${doc.totalAdditions} -${doc.totalDeletions}\n\n${fileList}`
}

function truncateDiff(doc: DiffDocument, maxTokens: number): string {
  const chunks: string[] = []
  let tokenCount = 0

  for (const file of doc.files) {
    const fileChunk = [
      `--- ${file.path} (${file.status}) ---`,
      ...file.hunks.map((h) => [h.header, ...h.lines].join('\n')),
    ].join('\n')

    const fileTokens = estimateTokens(fileChunk)

    if (tokenCount + fileTokens > maxTokens) {
      chunks.push(`--- ${file.path} (${file.status}) --- [truncated — too large]`)
      continue
    }

    chunks.push(fileChunk)
    tokenCount += fileTokens
  }

  return chunks.join('\n\n')
}

export function buildPrompt(doc: DiffDocument, mode: AnalyzeMode): AnthropicMessage {
  const system = selectSystemPrompt(mode)
  const summary = buildDiffSummary(doc)
  const diffText = truncateDiff(doc, MAX_TOKENS)

  const user = `${summary}\n\n${diffText}`

  return { system, user }
}

import type { AnalyzeResult } from './ai-client.js'

const MODE_LABELS: Record<string, string> = {
  description: 'PR Description',
  explain: 'Explanation',
  review: 'Risk Review',
}

export type FormatOptions = {
  showStats?: boolean
}

export function formatOutput(result: AnalyzeResult, options: FormatOptions = {}): string {
  const parts: string[] = []

  if (options.showStats) {
    const label = MODE_LABELS[result.mode] ?? result.mode
    parts.push(`<!-- diffwise · ${label} · ${result.inputTokens} in / ${result.outputTokens} out tokens -->`)
    parts.push('')
  }

  parts.push(result.content)

  return parts.join('\n')
}

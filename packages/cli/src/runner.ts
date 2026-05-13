import { readFileSync } from 'node:fs'
import { consola } from 'consola'
import { parseDiff, buildPrompt, analyze, formatOutput } from '@diffwise/core'
import type { AnalyzeMode } from '@diffwise/core'

export type RunOptions = {
  file?: string
  mode: AnalyzeMode
  output?: string
  stats: boolean
}

async function readDiff(file?: string): Promise<string> {
  if (file) {
    return readFileSync(file, 'utf-8')
  }

  return new Promise((resolve, reject) => {
    let data = ''
    process.stdin.setEncoding('utf-8')
    process.stdin.on('data', (chunk) => { data += chunk })
    process.stdin.on('end', () => resolve(data))
    process.stdin.on('error', reject)
  })
}

export async function run(options: RunOptions): Promise<void> {
  const rawDiff = await readDiff(options.file)

  if (!rawDiff.trim()) {
    consola.error('No diff input provided. Use --file or pipe a diff via stdin.')
    process.exit(1)
  }

  const doc = parseDiff(rawDiff)

  if (doc.files.length === 0) {
    consola.warn('Could not parse any files from the diff.')
    process.exit(1)
  }

  consola.info(`Parsed ${doc.files.length} file(s) · +${doc.totalAdditions} -${doc.totalDeletions}`)

  const message = buildPrompt(doc, options.mode)
  const result = await analyze(message, { mode: options.mode })
  const output = formatOutput(result, { showStats: options.stats })

  if (options.output) {
    const { writeFileSync } = await import('node:fs')
    writeFileSync(options.output, output, 'utf-8')
    consola.success(`Output written to ${options.output}`)
  } else {
    process.stdout.write(output + '\n')
  }
}

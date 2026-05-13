#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import { run } from './runner.js'
import type { AnalyzeMode } from '@diffwise/core'

const VALID_MODES: AnalyzeMode[] = ['description', 'explain', 'review']

const main = defineCommand({
  meta: {
    name: 'diffwise',
    version: '0.1.0',
    description: 'AI-powered Git diff explainer',
  },
  args: {
    file: {
      type: 'string',
      description: 'Path to a .diff file (omit to read from stdin)',
      alias: 'f',
    },
    mode: {
      type: 'string',
      description: 'Output mode: description | explain | review',
      alias: 'm',
      default: 'description',
    },
    output: {
      type: 'string',
      description: 'Write output to a file instead of stdout',
      alias: 'o',
    },
    stats: {
      type: 'boolean',
      description: 'Show token usage stats in output',
      default: false,
    },
  },
  async run({ args }) {
    const mode = args.mode as string

    if (!VALID_MODES.includes(mode as AnalyzeMode)) {
      consola.error(`Invalid mode: "${mode}". Valid modes: ${VALID_MODES.join(', ')}`)
      process.exit(1)
    }

    await run({
      mode: mode as AnalyzeMode,
      stats: args.stats as boolean,
      ...(args.file !== undefined && { file: args.file as string }),
      ...(args.output !== undefined && { output: args.output as string }),
    })
  },
})

runMain(main)

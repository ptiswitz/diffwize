import Anthropic from '@anthropic-ai/sdk'
import { consola } from 'consola'
import type { AnthropicMessage } from './prompt-builder.js'

export type AnalyzeMode = 'description' | 'explain' | 'review'

export type AnalyzeOptions = {
  mode: AnalyzeMode
  apiKey?: string
}

export type AnalyzeResult = {
  content: string
  mode: AnalyzeMode
  inputTokens: number
  outputTokens: number
}

type AnthropicApiError = {
  status: number
  message: string
}

function isAnthropicApiError(error: unknown): error is AnthropicApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  )
}

export async function analyze(
  message: AnthropicMessage,
  options: AnalyzeOptions,
): Promise<AnalyzeResult> {
  const apiKey = options.apiKey ?? process.env['ANTHROPIC_API_KEY']

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set. Add it to your .env file.')
  }

  const client = new Anthropic({ apiKey })

  consola.debug(`Sending diff to Claude (mode: ${options.mode})...`)

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: message.system,
      messages: [{ role: 'user', content: message.user }],
    })

    const textBlock = response.content.find((block) => block.type === 'text')

    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Unexpected response format from Anthropic API')
    }

    return {
      content: textBlock.text,
      mode: options.mode,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    }
  } catch (error: unknown) {
    if (isAnthropicApiError(error)) {
      throw new Error(`Anthropic API error (${error.status}): ${error.message}`)
    }
    throw error
  }
}

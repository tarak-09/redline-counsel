import { anthropic } from '@ai-sdk/anthropic'
import { convertToModelMessages, streamText } from 'ai'
import { NextRequest } from 'next/server'
import { buildChatSystemPrompt } from '@/lib/prompts'
import { getPersona } from '@/lib/personas'
import type { ClauseChange } from '@/lib/types'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { messages, personaId, clauses } = (await req.json()) as {
    messages: Parameters<typeof convertToModelMessages>[0]
    personaId: string
    clauses: ClauseChange[]
  }

  const persona = getPersona(personaId)
  const systemPrompt = buildChatSystemPrompt(persona, clauses)

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 600,
  })

  return result.toUIMessageStreamResponse()
}

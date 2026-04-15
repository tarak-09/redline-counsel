import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { diffContracts } from '@/lib/differ'
import { buildAnalysisPrompt } from '@/lib/prompts'
import type { ClauseChange, IssueType, RiskLevel } from '@/lib/types'

function computeFrictionScore(clauses: ClauseChange[]): number {
  if (clauses.length === 0) return 0
  const weights: Record<RiskLevel, number> = { HIGH: 100, MEDIUM: 50, LOW: 20 }
  const total = clauses.reduce((sum, c) => sum + weights[c.risk_level], 0)
  return Math.min(100, Math.round(total / clauses.length))
}

export async function POST(req: NextRequest) {
  try {
    const { originalText, revisedText } = (await req.json()) as {
      originalText: string
      revisedText: string
    }

    if (!originalText || !revisedText) {
      return NextResponse.json(
        { error: 'Both originalText and revisedText are required' },
        { status: 400 }
      )
    }

    const diffs = diffContracts(originalText, revisedText)

    if (diffs.length === 0) {
      return NextResponse.json({ clauses: [], frictionScore: 0 })
    }

    const prompt = buildAnalysisPrompt(diffs)

    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-6'),
      prompt,
      maxOutputTokens: 2048,
    })

    let rawClauses: Array<{
      clauseNumber: string
      clauseTitle: string
      issue_type: string
      risk_level: string
      one_liner: string
    }>

    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      rawClauses = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch {
      throw new Error('Failed to parse response as JSON')
    }

    const clauses: ClauseChange[] = rawClauses.map((raw, i) => {
      const diff = diffs.find((d) => d.sectionNumber === raw.clauseNumber) ?? diffs[i] ?? diffs[0]
      return {
        id: `clause-${raw.clauseNumber}-${i}`,
        clauseNumber: raw.clauseNumber,
        clauseTitle: raw.clauseTitle,
        originalText: diff?.originalText ?? '',
        revisedText: diff?.revisedText ?? '',
        issue_type: raw.issue_type as IssueType,
        risk_level: raw.risk_level as RiskLevel,
        one_liner: raw.one_liner,
      }
    })

    return NextResponse.json({ clauses, frictionScore: computeFrictionScore(clauses) })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}

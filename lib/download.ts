import type { ClauseChange } from './types'

interface SimpleMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function generateMarkdownReport(
  clauses: ClauseChange[],
  frictionScore: number,
  personaName: string,
  messages: SimpleMessage[]
): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const clauseSection = clauses
    .map(
      (c) => `### Clause ${c.clauseNumber}: ${c.clauseTitle}
- **Issue Type:** ${c.issue_type}
- **Risk Level:** ${c.risk_level}
- **Summary:** ${c.one_liner}

**Original:**
> ${c.originalText}

**Revised:**
> ${c.revisedText}
`
    )
    .join('\n')

  const transcript = messages
    .map((m) => `**${m.role === 'user' ? 'You' : personaName}:**\n${m.content}`)
    .join('\n\n---\n\n')

  return `# Redline Counsel — Negotiation Summary
Generated: ${date}
Persona: ${personaName}
Friction Score: ${frictionScore}/100

---

## Clause Changes & Risk Analysis

${clauseSection}
---

## Negotiation Transcript

${transcript}
`
}

import type { ClauseChange, Persona } from './types'

function formatClausesForPrompt(clauses: ClauseChange[]): string {
  return clauses
    .map(
      (c, i) =>
        `[Clause ${i + 1}] ${c.clauseTitle} (${c.issue_type.toUpperCase()}, ${c.risk_level} RISK)
Original: ${c.originalText.slice(0, 300)}
Revised: ${c.revisedText.slice(0, 300)}`
    )
    .join('\n\n')
}

export function buildAnalysisPrompt(
  diffs: { sectionNumber: string; sectionTitle: string; originalText: string; revisedText: string }[]
): string {
  const diffsText = diffs
    .map(
      (d) =>
        `Section ${d.sectionNumber} — ${d.sectionTitle}:
ORIGINAL: ${d.originalText.slice(0, 400)}
REVISED: ${d.revisedText.slice(0, 400)}`
    )
    .join('\n\n---\n\n')

  return `You are a contract analysis expert. Analyze the following changed contract sections and classify each one.

For each changed section, return a JSON object with:
- clauseNumber: the section number as a string
- clauseTitle: the section title
- issue_type: one of [liability, ip_rights, termination, payment, confidentiality, indemnification, governing_law, other]
- risk_level: HIGH, MEDIUM, or LOW (risk to the receiving/customer party)
- one_liner: a single sentence explaining what changed and why it matters commercially

Return a JSON array only. No markdown, no explanation, just the raw JSON array.

CHANGED SECTIONS:
${diffsText}`
}

export function buildChatSystemPrompt(persona: Persona, clauses: ClauseChange[]): string {
  const clauseList = formatClausesForPrompt(clauses)

  return `You are ${persona.name}, an experienced contract negotiator representing the ${persona.side} in a contract negotiation.

NEGOTIATION CONTEXT:
The following clauses have been changed in the revised contract. You are reviewing these changes and will argue your client's position.

${clauseList}

YOUR PERSONA:
Style: ${persona.style}
Priorities: ${persona.priorities.join(', ')}

INSTRUCTIONS:
- Always argue from your persona's perspective with specific legal and business reasoning
- Cite clauses using [Clause N] notation whenever you reference specific contract text
- Be direct and assertive — you are a skilled negotiator, not a chatbot
- After your argument, ALWAYS provide a "Counterproposal:" section on a new line with specific revised language your client would accept
- Keep responses under 200 words unless asked to elaborate
- Never break character`
}

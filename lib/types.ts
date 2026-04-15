export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export type IssueType =
  | 'liability'
  | 'ip_rights'
  | 'termination'
  | 'payment'
  | 'confidentiality'
  | 'indemnification'
  | 'governing_law'
  | 'other'

export type PersonaId = 'aggressive-procurement' | 'cautious-in-house' | 'neutral-mediator'

export interface ClauseChange {
  id: string
  clauseNumber: string
  clauseTitle: string
  originalText: string
  revisedText: string
  issue_type: IssueType
  risk_level: RiskLevel
  one_liner: string
}

export interface Persona {
  id: PersonaId
  name: string
  side: string
  style: string
  priorities: string[]
  icon: string
}

export interface AnalysisResult {
  clauses: ClauseChange[]
  frictionScore: number
}

export interface NegotiationState {
  originalText: string
  revisedText: string
  persona: PersonaId | null
  analysis: AnalysisResult | null
  activeClauseId: string | null
  setOriginalText: (text: string) => void
  setRevisedText: (text: string) => void
  setPersona: (persona: PersonaId) => void
  setAnalysis: (analysis: AnalysisResult) => void
  setActiveClauseId: (id: string | null) => void
  reset: () => void
}

'use client'

import { useNegotiationStore } from '@/store/negotiation'
import { ClauseCard } from './ClauseCard'
import { FrictionScore } from './FrictionScore'

interface ClauseNavigatorProps {
  onClauseSelect: (question: string) => void
}

export function ClauseNavigator({ onClauseSelect }: ClauseNavigatorProps) {
  const { analysis, activeClauseId, setActiveClauseId } = useNegotiationStore()

  if (!analysis) return null

  function handleClauseClick(clauseId: string, clauseTitle: string) {
    setActiveClauseId(clauseId)
    onClauseSelect(`What is your position on the ${clauseTitle} clause?`)
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700">Changed Clauses</h2>
        <p className="text-xs text-slate-400 mt-0.5">{analysis.clauses.length} changes detected</p>
      </div>

      <FrictionScore score={analysis.frictionScore} />

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {analysis.clauses.map((clause) => (
          <ClauseCard
            key={clause.id}
            clause={clause}
            isActive={activeClauseId === clause.id}
            onClick={() => handleClauseClick(clause.id, clause.clauseTitle)}
          />
        ))}
      </div>
    </div>
  )
}

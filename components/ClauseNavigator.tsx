'use client'

import { FileSearch } from 'lucide-react'
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
    <div className="flex flex-col h-full bg-white">
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-slate-100 shrink-0">
        <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
          Changed Clauses
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {analysis.clauses.length} change{analysis.clauses.length !== 1 ? 's' : ''} detected
        </p>
      </div>

      <FrictionScore score={analysis.frictionScore} />

      {/* Clause list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {analysis.clauses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <FileSearch className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No changes detected</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              The two contracts appear to be identical.
            </p>
          </div>
        ) : (
          analysis.clauses.map((clause) => (
            <ClauseCard
              key={clause.id}
              clause={clause}
              isActive={activeClauseId === clause.id}
              onClick={() => handleClauseClick(clause.id, clause.clauseTitle)}
            />
          ))
        )}
      </div>
    </div>
  )
}

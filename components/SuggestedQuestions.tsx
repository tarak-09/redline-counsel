'use client'

import type { ClauseChange } from '@/lib/types'

interface SuggestedQuestionsProps {
  clauses: ClauseChange[]
  onSelect: (question: string) => void
}

export function SuggestedQuestions({ clauses, onSelect }: SuggestedQuestionsProps) {
  const highRisk = clauses.find((c) => c.risk_level === 'HIGH')
  const medRisk = clauses.find((c) => c.risk_level === 'MEDIUM')

  const questions = [
    highRisk
      ? `What's your position on the ${highRisk.clauseTitle} clause?`
      : "What's your biggest concern with these changes?",
    medRisk
      ? `Would you accept a mutual ${medRisk.clauseTitle.toLowerCase()} provision?`
      : 'Would you accept mutual obligations here?',
    "What's your walk-away condition on this contract?",
  ]

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
        >
          {q}
        </button>
      ))}
    </div>
  )
}

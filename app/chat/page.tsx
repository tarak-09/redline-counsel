'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scale, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useNegotiationStore } from '@/store/negotiation'
import { ClauseNavigator } from '@/components/ClauseNavigator'
import { ChatPanel } from '@/components/ChatPanel'

export default function ChatPage() {
  const router = useRouter()
  const { analysis, persona, setActiveClauseId } = useNegotiationStore()
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)

  useEffect(() => {
    if (!analysis || !persona) {
      router.replace('/')
    }
  }, [analysis, persona, router])

  function handleClauseSelect(question: string) {
    setPendingQuestion(question)
  }

  function handleClauseHighlight(clauseId: string) {
    setActiveClauseId(clauseId)
  }

  if (!analysis) return null

  const highRiskCount = analysis.clauses.filter((c) => c.risk_level === 'HIGH').length

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Back to upload"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600">
            <Scale className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">Redline Counsel</span>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{analysis.clauses.length}</span>
              <span>clauses changed</span>
            </div>
            {highRiskCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-full px-2.5 py-1">
                <AlertTriangle className="h-3 w-3" />
                {highRiskCount} high risk
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span>Friction</span>
              <span
                className={[
                  'font-bold tabular-nums',
                  analysis.frictionScore >= 70
                    ? 'text-red-600'
                    : analysis.frictionScore >= 40
                    ? 'text-amber-600'
                    : 'text-emerald-600',
                ].join(' ')}
              >
                {analysis.frictionScore}/100
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left — Clause navigator */}
        <div className="w-full md:w-[340px] shrink-0 border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden flex flex-col">
          {/* Mobile: fixed height scrollable strip */}
          <div className="h-52 md:h-full overflow-y-auto">
            <ClauseNavigator onClauseSelect={handleClauseSelect} />
          </div>
        </div>

        {/* Right — Chat */}
        <div className="flex-1 overflow-hidden min-w-0">
          <ChatPanel
            onClauseHighlight={handleClauseHighlight}
            pendingQuestion={pendingQuestion}
            clearPendingQuestion={() => setPendingQuestion(null)}
          />
        </div>
      </div>
    </div>
  )
}

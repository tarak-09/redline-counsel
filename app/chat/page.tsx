'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scale, ArrowLeft } from 'lucide-react'
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

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Scale className="h-5 w-5 text-blue-600" />
          <span className="text-base font-bold text-slate-800">Redline Counsel</span>
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
            <span className="hidden sm:block">
              {analysis.clauses.length} clauses changed
            </span>
            <span className="hidden sm:block">·</span>
            <span className="hidden sm:block">
              friction score {analysis.frictionScore}/100
            </span>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left — Clause navigator (35%) */}
        <div className="w-full md:w-[35%] md:max-w-[380px] shrink-0 border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden flex flex-col">
          <div className="h-56 md:h-full overflow-y-auto">
            <ClauseNavigator onClauseSelect={handleClauseSelect} />
          </div>
        </div>

        {/* Right — Chat (65%) */}
        <div className="flex-1 overflow-hidden">
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

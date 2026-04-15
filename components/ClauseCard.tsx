'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { ClauseChange } from '@/lib/types'

const riskStyles = {
  HIGH: 'bg-red-100 text-red-800',
  MEDIUM: 'bg-amber-100 text-amber-800',
  LOW: 'bg-green-100 text-green-800',
}

const dotStyles = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-amber-400',
  LOW: 'bg-green-500',
}

const issueLabels: Record<string, string> = {
  liability: 'Liability',
  ip_rights: 'IP Rights',
  termination: 'Termination',
  payment: 'Payment',
  confidentiality: 'Confidentiality',
  indemnification: 'Indemnification',
  governing_law: 'Governing Law',
  other: 'Other',
}

interface ClauseCardProps {
  clause: ClauseChange
  isActive: boolean
  onClick: () => void
}

export function ClauseCard({ clause, isActive, onClick }: ClauseCardProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function copyClauseText() {
    await navigator.clipboard.writeText(clause.revisedText || clause.originalText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={[
        'rounded-lg border transition-all',
        isActive
          ? 'border-blue-300 bg-blue-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300',
      ].join(' ')}
    >
      <div className="p-3 cursor-pointer" onClick={onClick}>
        <div className="flex items-start gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${dotStyles[clause.risk_level]}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-xs font-semibold text-slate-600">§{clause.clauseNumber}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${riskStyles[clause.risk_level]}`}>
                {clause.risk_level}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                {issueLabels[clause.issue_type] ?? clause.issue_type}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700">{clause.clauseTitle}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{clause.one_liner}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 px-3 pb-2 border-t border-slate-100 pt-2">
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? 'Hide text' : 'View text'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); copyClauseText() }}
          className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          {copied ? (
            <><Check className="h-3 w-3 text-emerald-500" /><span className="text-emerald-600">Copied</span></>
          ) : (
            <><Copy className="h-3 w-3" />Copy</>
          )}
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-slate-100 pt-2">
          {clause.originalText && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Original</p>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded p-2">
                {clause.originalText.slice(0, 300)}
                {clause.originalText.length > 300 ? '…' : ''}
              </p>
            </div>
          )}
          {clause.revisedText && (
            <div>
              <p className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-1">Revised</p>
              <p className="text-xs text-slate-600 leading-relaxed bg-violet-50 rounded p-2">
                {clause.revisedText.slice(0, 300)}
                {clause.revisedText.length > 300 ? '…' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

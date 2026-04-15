'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { ClauseChange } from '@/lib/types'
import { wordDiff } from '@/lib/wordDiff'

const riskBadge = {
  HIGH:   'bg-red-50 text-red-600 border border-red-200',
  MEDIUM: 'bg-amber-50 text-amber-600 border border-amber-200',
  LOW:    'bg-green-50 text-green-600 border border-green-200',
}

const riskDot = {
  HIGH:   'bg-red-500',
  MEDIUM: 'bg-amber-400',
  LOW:    'bg-green-500',
}

const issueLabels: Record<string, string> = {
  liability:       'Liability',
  ip_rights:       'IP Rights',
  termination:     'Termination',
  payment:         'Payment',
  confidentiality: 'Confidentiality',
  indemnification: 'Indemnification',
  governing_law:   'Governing Law',
  other:           'Other',
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
        'rounded-xl border transition-all duration-150',
        isActive
          ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
      ].join(' ')}
    >
      {/* Main clickable area */}
      <div className="p-3 cursor-pointer" onClick={onClick}>
        <div className="flex items-start gap-2.5">
          <span
            className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${riskDot[clause.risk_level]}`}
          />
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Badges row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400">§{clause.clauseNumber}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${riskBadge[clause.risk_level]}`}
              >
                {clause.risk_level}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium border border-slate-200">
                {issueLabels[clause.issue_type] ?? clause.issue_type}
              </span>
            </div>

            {/* Title */}
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              {clause.clauseTitle}
            </p>

            {/* One-liner summary */}
            <p className="text-xs text-slate-500 leading-relaxed">{clause.one_liner}</p>
          </div>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-1 px-3 pb-2.5 pt-1.5 border-t border-slate-100">
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
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Inline word diff */}
      {expanded && (
        <div className="px-3 pb-3 pt-2.5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Changes
          </p>
          <p className="text-xs leading-relaxed bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            {wordDiff(clause.originalText, clause.revisedText).map((token, i) =>
              token.type === 'removed' ? (
                <span key={i} className="bg-red-100 text-red-700 line-through">{token.text}</span>
              ) : token.type === 'added' ? (
                <span key={i} className="bg-green-100 text-green-700 font-medium">{token.text}</span>
              ) : (
                <span key={i} className="text-slate-600">{token.text}</span>
              )
            )}
          </p>
        </div>
      )}
    </div>
  )
}

'use client'

import { personas } from '@/lib/personas'
import type { PersonaId } from '@/lib/types'

interface PersonaSelectorProps {
  value: PersonaId | null
  onChange: (id: PersonaId) => void
}

export function PersonaSelector({ value, onChange }: PersonaSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {personas.map((p) => {
        const isSelected = value === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id as PersonaId)}
            className={[
              'rounded-xl border-2 p-4 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-200'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm',
            ].join(' ')}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl leading-none">{p.icon}</span>
              {isSelected && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 shrink-0">
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.5 6.5l2 2 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-800 mb-1">{p.name}</p>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{p.style}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {p.priorities.slice(0, 2).map((priority) => (
                <span
                  key={priority}
                  className={[
                    'text-xs px-1.5 py-0.5 rounded font-medium',
                    isSelected
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {priority}
                </span>
              ))}
            </div>
          </button>
        )
      })}
    </div>
  )
}

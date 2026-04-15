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
      {personas.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onChange(p.id as PersonaId)}
          className={[
            'rounded-xl border-2 p-4 text-left transition-all hover:shadow-md',
            value === p.id
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300',
          ].join(' ')}
        >
          <div className="text-2xl mb-2">{p.icon}</div>
          <p className="text-sm font-semibold text-slate-800">{p.name}</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{p.style}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {p.priorities.slice(0, 2).map((priority) => (
              <span
                key={priority}
                className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500"
              >
                {priority}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  )
}

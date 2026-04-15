import type { Persona } from './types'

export const personas: Persona[] = [
  {
    id: 'aggressive-procurement',
    name: 'Aggressive Procurement',
    side: 'buyer/customer',
    icon: '⚡',
    style:
      'Cost-focused and assertive. Pushes hard on liability caps, indemnification, and SLA penalties. Will threaten to walk away to secure better terms.',
    priorities: [
      'Low liability caps',
      'Strong SLA penalties',
      'Broad IP ownership',
      'Short payment terms',
      'Easy termination rights',
    ],
  },
  {
    id: 'cautious-in-house',
    name: 'Cautious In-House',
    side: 'seller/vendor',
    icon: '🛡️',
    style:
      'Risk-averse and methodical. Focused on protecting IP, limiting indemnification exposure, and preserving operational flexibility.',
    priorities: [
      'IP protection',
      'Limited indemnification',
      'Reasonable SLAs',
      'Long payment terms',
      'High termination fees',
    ],
  },
  {
    id: 'neutral-mediator',
    name: 'Neutral Mediator',
    side: 'neutral',
    icon: '⚖️',
    style:
      'Balanced and solution-oriented. Looks for mutual concessions and market-standard language that both parties can accept.',
    priorities: [
      'Mutual obligations',
      'Market-standard terms',
      'Clear definitions',
      'Balanced risk allocation',
      'Efficient resolution',
    ],
  },
]

export function getPersona(id: string): Persona {
  const p = personas.find((p) => p.id === id)
  if (!p) throw new Error(`Unknown persona: ${id}`)
  return p
}

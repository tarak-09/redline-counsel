import { Gavel } from 'lucide-react'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  personaName: string
  personaIcon: string
  onClauseClick: (clauseNumber: string) => void
}

function parseCounterproposal(text: string): { main: string; counterproposal: string | null } {
  const idx = text.search(/\ncounterproposal:/i)
  if (idx === -1) return { main: text, counterproposal: null }
  return {
    main: text.slice(0, idx).trim(),
    counterproposal: text
      .slice(idx)
      .replace(/\ncounterproposal:/i, '')
      .trim(),
  }
}

function renderWithClauseLinks(
  text: string,
  onClauseClick: (n: string) => void
): React.ReactNode[] {
  const parts = text.split(/(\[Clause \d+\])/g)
  return parts.map((part, i) => {
    const m = part.match(/\[Clause (\d+)\]/)
    if (m) {
      return (
        <button
          key={i}
          onClick={() => onClauseClick(m[1])}
          className="text-blue-600 font-semibold hover:underline focus:outline-none"
        >
          {part}
        </button>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function MessageBubble({
  role,
  content,
  personaName,
  personaIcon,
  onClauseClick,
}: MessageBubbleProps) {
  const isUser = role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-sm text-white leading-relaxed">
          {content}
        </div>
      </div>
    )
  }

  const { main, counterproposal } = parseCounterproposal(content)

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0 mt-0.5 border border-slate-200 select-none">
        {personaIcon}
      </div>

      <div className="flex-1 max-w-[85%] space-y-2">
        {/* Main message bubble */}
        <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
          <p className="text-xs font-semibold text-slate-400 mb-1.5">{personaName}</p>
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {renderWithClauseLinks(main, onClauseClick)}
          </p>
        </div>

        {/* Counterproposal block */}
        {counterproposal && (
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-indigo-200 bg-indigo-100/60">
              <Gavel className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
                Counterproposal
              </span>
            </div>
            <div className="px-4 py-3">
              <p
                className="text-xs leading-relaxed whitespace-pre-wrap text-indigo-900"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {counterproposal}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

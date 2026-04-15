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
    counterproposal: text.slice(idx).replace(/\ncounterproposal:/i, '').trim(),
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

export function MessageBubble({ role, content, personaName, personaIcon, onClauseClick }: MessageBubbleProps) {
  const isUser = role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5 text-sm text-white leading-relaxed">
          {content}
        </div>
      </div>
    )
  }

  const { main, counterproposal } = parseCounterproposal(content)

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0 mt-0.5 border border-slate-200">
        {personaIcon}
      </div>
      <div className="flex-1 max-w-[85%] space-y-2">
        <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-sm text-slate-800 leading-relaxed">
          <p className="text-xs font-semibold text-slate-500 mb-1.5">{personaName}</p>
          <p className="whitespace-pre-wrap">{renderWithClauseLinks(main, onClauseClick)}</p>
        </div>
        {counterproposal && (
          <div className="rounded-xl bg-sky-50 border border-sky-200 px-4 py-3">
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">
              Counterproposal
            </p>
            <p className="text-xs font-mono text-sky-900 leading-relaxed whitespace-pre-wrap">
              {counterproposal}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

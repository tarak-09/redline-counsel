interface FrictionScoreProps {
  score: number
}

function getLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: 'High Contention', color: 'text-red-700' }
  if (score >= 40) return { label: 'Moderate Friction', color: 'text-amber-700' }
  return { label: 'Clean Agreement', color: 'text-emerald-700' }
}

function getBarColor(score: number): string {
  if (score >= 70) return 'bg-red-500'
  if (score >= 40) return 'bg-amber-400'
  return 'bg-emerald-500'
}

export function FrictionScore({ score }: FrictionScoreProps) {
  const { label, color } = getLabel(score)
  return (
    <div className="px-4 py-3 border-b border-slate-100">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Friction Score
        </span>
        <span className={`text-xs font-bold ${color}`}>{label}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-right text-xs text-slate-400 mt-1">{score}/100</p>
    </div>
  )
}

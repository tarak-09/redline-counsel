interface FrictionScoreProps {
  score: number
}

function getLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: 'High Contention', color: 'text-red-600' }
  if (score >= 40) return { label: 'Moderate Friction', color: 'text-amber-600' }
  return { label: 'Clean Agreement', color: 'text-emerald-600' }
}

export function FrictionScore({ score }: FrictionScoreProps) {
  const { label, color } = getLabel(score)

  // Gradient: green (0) → yellow (50) → red (100)
  const hue = Math.round(120 - score * 1.2) // 120=green, 0=red
  const barColor = `hsl(${hue}, 72%, 42%)`

  return (
    <div className="px-4 py-3.5 border-b border-slate-100 bg-white">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Friction Score
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-xl font-bold tabular-nums ${color}`}>{score}</span>
          <span className="text-xs text-slate-400 font-medium">/100</span>
        </div>
      </div>

      {/* Bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: barColor }}
        />
      </div>

      <p className={`text-xs font-medium mt-1.5 ${color}`}>{label}</p>
    </div>
  )
}

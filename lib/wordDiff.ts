export type DiffToken = { text: string; type: 'same' | 'removed' | 'added' }

/** Tokenise preserving whitespace so the rendered output looks natural */
function tokenise(s: string): string[] {
  return s.match(/\S+|\s+/g) ?? []
}

/**
 * Word-level LCS diff. Returns tokens tagged same / removed / added.
 * Iterative backtracking — safe for clause-length texts.
 */
export function wordDiff(original: string, revised: string): DiffToken[] {
  const a = tokenise(original.trim())
  const b = tokenise(revised.trim())
  const m = a.length
  const n = b.length

  // Build DP table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  // Backtrack iteratively
  const tokens: DiffToken[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      tokens.unshift({ text: a[i - 1], type: 'same' })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tokens.unshift({ text: b[j - 1], type: 'added' })
      j--
    } else {
      tokens.unshift({ text: a[i - 1], type: 'removed' })
      i--
    }
  }
  return tokens
}

export function parseIntoSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {}

  // Match "SECTION N. TITLE" or "N. TITLE" at line start
  const sectionRegex = /^(?:SECTION\s+)?(\d+)\.\s+([A-Z][A-Z\s]+)$/gm
  const matches = Array.from(text.matchAll(sectionRegex))

  if (matches.length === 0) {
    // Fallback: split on double newlines and number them
    const blocks = text.split(/\n\s*\n/).filter((b) => b.trim().length > 0)
    blocks.forEach((block, i) => {
      sections[String(i + 1)] = block.trim()
    })
    return sections
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const nextMatch = matches[i + 1]
    const num = match[1]
    const start = (match.index ?? 0) + match[0].length
    const end = nextMatch?.index ?? text.length
    sections[num] = `${match[0]}\n${text.slice(start, end).trim()}`
  }

  return sections
}

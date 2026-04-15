import { parseIntoSections } from './parser'

export interface SectionDiff {
  sectionNumber: string
  sectionTitle: string
  originalText: string
  revisedText: string
  changeType: 'modified' | 'added' | 'removed'
}

function extractTitle(text: string): string {
  const m = text.match(/^(?:SECTION\s+)?\d+\.\s+(.+)$/m)
  return m ? m[1].trim() : 'Unknown Section'
}

export function diffContracts(original: string, revised: string): SectionDiff[] {
  const origSections = parseIntoSections(original)
  const revSections = parseIntoSections(revised)

  const diffs: SectionDiff[] = []
  const allKeys = Array.from(new Set([...Object.keys(origSections), ...Object.keys(revSections)]))

  for (const key of allKeys) {
    const origText = origSections[key] ?? ''
    const revText = revSections[key] ?? ''

    if (origText === revText) continue

    let changeType: SectionDiff['changeType'] = 'modified'
    if (!origText) changeType = 'added'
    else if (!revText) changeType = 'removed'

    const titleText = revText || origText
    diffs.push({
      sectionNumber: key,
      sectionTitle: extractTitle(titleText),
      originalText: origText,
      revisedText: revText,
      changeType,
    })
  }

  return diffs.sort((a, b) => Number(a.sectionNumber) - Number(b.sectionNumber))
}

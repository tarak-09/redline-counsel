import { create } from 'zustand'
import type { NegotiationState, AnalysisResult, PersonaId } from '@/lib/types'

export const useNegotiationStore = create<NegotiationState>((set) => ({
  originalText: '',
  revisedText: '',
  persona: null,
  analysis: null,
  activeClauseId: null,
  setOriginalText: (text) => set({ originalText: text }),
  setRevisedText: (text) => set({ revisedText: text }),
  setPersona: (persona: PersonaId) => set({ persona }),
  setAnalysis: (analysis: AnalysisResult) => set({ analysis }),
  setActiveClauseId: (id) => set({ activeClauseId: id }),
  reset: () =>
    set({
      originalText: '',
      revisedText: '',
      persona: null,
      analysis: null,
      activeClauseId: null,
    }),
}))

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scale, Loader2 } from 'lucide-react'
import { UploadZone } from '@/components/UploadZone'
import { PersonaSelector } from '@/components/PersonaSelector'
import { useNegotiationStore } from '@/store/negotiation'
import type { AnalysisResult, PersonaId } from '@/lib/types'

const SAMPLE_CONTRACTS = [
  { type: 'msa', label: 'MSA', description: 'Master Service Agreement' },
  { type: 'nda', label: 'NDA', description: 'Non-Disclosure Agreement' },
  { type: 'saas', label: 'SaaS', description: 'SaaS Subscription Agreement' },
  { type: 'employment', label: 'Employment', description: 'Employment Agreement' },
] as const

type SampleType = (typeof SAMPLE_CONTRACTS)[number]['type']

export default function UploadPage() {
  const router = useRouter()
  const { setOriginalText, setRevisedText, setPersona, setAnalysis } = useNegotiationStore()

  const [original, setOriginal] = useState('')
  const [revised, setRevised] = useState('')
  const [persona, setLocalPersona] = useState<PersonaId | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingSample, setLoadingSample] = useState<SampleType | null>(null)

  async function loadSampleContracts(type: SampleType) {
    setLoadingSample(type)
    setError(null)
    try {
      const [origRes, revRes] = await Promise.all([
        fetch(`/api/sample?file=original&type=${type}`),
        fetch(`/api/sample?file=revised&type=${type}`),
      ])
      if (!origRes.ok || !revRes.ok) throw new Error('Failed to load sample files')
      const [origText, revText] = await Promise.all([origRes.text(), revRes.text()])
      setOriginal(origText)
      setRevised(revText)
    } catch {
      setError('Failed to load sample contracts.')
    } finally {
      setLoadingSample(null)
    }
  }

  async function handleAnalyze() {
    if (!original || !revised || !persona) return
    setIsAnalyzing(true)
    setError(null)

    setOriginalText(original)
    setRevisedText(revised)
    setPersona(persona)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalText: original, revisedText: revised, persona }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Analysis failed')
      }
      const analysis = (await res.json()) as AnalysisResult
      setAnalysis(analysis)
      router.push('/chat')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = original.trim() && revised.trim() && persona && !isAnalyzing

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-600" />
          <span className="text-base font-bold text-slate-800">Redline Counsel</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">
            Simulate opposing counsel.{' '}
            <span className="text-blue-600">Negotiate smarter.</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Upload your original and redlined contracts, choose a negotiating persona, and get
            clause-by-clause AI analysis with live streaming counterproposals.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <span className="self-center text-xs text-slate-400 font-medium mr-1">⚡ Load sample:</span>
          {SAMPLE_CONTRACTS.map(({ type, label, description }) => (
            <button
              key={type}
              onClick={() => loadSampleContracts(type)}
              disabled={loadingSample !== null}
              title={description}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-60 font-medium"
            >
              {loadingSample === type ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" />{label}</>
              ) : (
                label
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Upload contracts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UploadZone label="Original Contract" variant="original" value={original} onChange={setOriginal} />
            <UploadZone label="Revised Contract" variant="revised" value={revised} onChange={setRevised} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Choose opposing counsel persona</h2>
          <PersonaSelector value={persona} onChange={setLocalPersona} />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-center pb-4">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isAnalyzing ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Analyzing with Claude…</>
            ) : (
              'Analyze Contracts →'
            )}
          </button>
        </div>
      </main>

      <footer className="text-center pb-8 text-xs text-slate-400">
        Built for Ruli engineering interview · Powered by Claude
      </footer>
    </div>
  )
}

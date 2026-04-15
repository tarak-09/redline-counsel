'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Scale, Loader2, FileText } from 'lucide-react'
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

const ANALYZING_STEPS = [
  'Parsing contract sections…',
  'Identifying changed clauses…',
  'Assessing risk levels…',
  'Generating clause summaries…',
  'Finalizing analysis…',
]

type SampleType = (typeof SAMPLE_CONTRACTS)[number]['type']

export default function UploadPage() {
  const router = useRouter()
  const { setOriginalText, setRevisedText, setPersona, setAnalysis } = useNegotiationStore()

  const [original, setOriginal] = useState('')
  const [revised, setRevised] = useState('')
  const [persona, setLocalPersona] = useState<PersonaId | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzingStep, setAnalyzingStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loadingSample, setLoadingSample] = useState<SampleType | null>(null)

  useEffect(() => {
    if (!isAnalyzing) return
    setAnalyzingStep(0)
    const interval = setInterval(() => {
      setAnalyzingStep((s) => (s < ANALYZING_STEPS.length - 1 ? s + 1 : s))
    }, 1400)
    return () => clearInterval(interval)
  }, [isAnalyzing])

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
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600">
            <Scale className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">Redline Counsel</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Powered by Claude claude-sonnet-4-6
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Simulate opposing counsel.{' '}
            <span className="text-blue-600">Negotiate smarter.</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Upload your original and redlined contracts, choose a negotiating persona, and get
            clause-by-clause AI analysis with live streaming counterproposals.
          </p>
        </div>

        {/* Sample contracts */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Or load a sample
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SAMPLE_CONTRACTS.map(({ type, description }) => (
              <button
                key={type}
                onClick={() => loadSampleContracts(type)}
                disabled={loadingSample !== null}
                title={description}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all disabled:opacity-50 font-medium shadow-sm"
              >
                {loadingSample === type ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                )}
                {description}
              </button>
            ))}
          </div>
        </div>

        {/* Upload section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">Upload contracts</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports .txt, .md, and .pdf — or paste text directly
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadZone label="Original Contract" variant="original" value={original} onChange={setOriginal} />
              <UploadZone label="Revised Contract" variant="revised" value={revised} onChange={setRevised} />
            </div>
          </div>
        </div>

        {/* Persona section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">Choose opposing counsel persona</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The persona shapes how the AI argues and what concessions it prioritizes
            </p>
          </div>
          <div className="p-6">
            <PersonaSelector value={persona} onChange={setLocalPersona} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
            <span className="mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Analyze CTA */}
        <div className="flex flex-col items-center gap-3 pb-4">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="inline-flex items-center gap-2.5 px-10 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {ANALYZING_STEPS[analyzingStep]}
              </>
            ) : (
              'Analyze Contracts'
            )}
          </button>
          {!canAnalyze && !isAnalyzing && (
            <p className="text-xs text-slate-400">
              {!original || !revised
                ? 'Upload both contract versions to continue'
                : 'Select a persona to continue'}
            </p>
          )}
        </div>
      </main>

      <footer className="text-center pb-8 text-xs text-slate-400">
        Redline Counsel · AI-powered contract negotiation
      </footer>
    </div>
  )
}

'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'

interface UploadZoneProps {
  label: string
  variant: 'original' | 'revised'
  value: string
  onChange: (text: string) => void
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(pageText)
  }

  return pages.join('\n\n')
}

export function UploadZone({ label, variant, value, onChange }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [readError, setReadError] = useState<string | null>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setFileName(file.name)
      setReadError(null)
      setIsReading(true)
      try {
        let text: string
        if (file.name.toLowerCase().endsWith('.pdf')) {
          text = await extractTextFromPdf(file)
        } else {
          text = await file.text()
        }
        if (!text.trim()) {
          setReadError('Could not extract text from this file.')
          setFileName(null)
          return
        }
        onChange(text)
      } catch {
        setReadError('Failed to read file. Make sure it is a valid .txt, .md, or .pdf.')
        setFileName(null)
      } finally {
        setIsReading(false)
      }
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const isOriginal = variant === 'original'
  const accentBorder = isOriginal ? 'border-blue-200' : 'border-violet-200'
  const accentBg = isOriginal ? 'bg-blue-50/50' : 'bg-violet-50/50'
  const iconColor = isOriginal ? 'text-blue-400' : 'text-violet-400'
  const labelColor = isOriginal ? 'text-blue-700' : 'text-violet-700'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${labelColor}`}>{label}</span>
        {value && (
          <button
            onClick={() => { onChange(''); setFileName(null) }}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {value ? (
        <div className={cn('rounded-lg border-2 px-4 py-3 flex items-center gap-3', accentBorder, accentBg)}>
          <FileText className={cn('h-5 w-5 shrink-0', iconColor)} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{fileName ?? 'Contract loaded'}</p>
            <p className="text-xs text-slate-500">{value.length.toLocaleString()} characters</p>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 cursor-pointer transition-all',
            isReading
              ? 'border-slate-300 bg-slate-100 cursor-wait'
              : isDragging
              ? cn(accentBorder, accentBg)
              : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-slate-300 mb-2" />
          <span className="text-sm text-slate-500 text-center">
            {isReading ? 'Reading file…' : <>Drop file or <span className="text-blue-600 font-medium">browse</span></>}
          </span>
          <span className="text-xs text-slate-400 mt-1">.txt, .md, .pdf</span>
          <input
            type="file"
            accept=".txt,.md,.pdf"
            className="hidden"
            onChange={handleInputChange}
            disabled={isReading}
          />
        </label>
      )}

      {readError && (
        <p className="text-xs text-red-600">{readError}</p>
      )}

      {!value && (
        <textarea
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          rows={4}
          placeholder="Or paste contract text here…"
          onChange={(e) => {
            if (e.target.value) {
              setFileName(null)
              onChange(e.target.value)
            }
          }}
        />
      )}
    </div>
  )
}

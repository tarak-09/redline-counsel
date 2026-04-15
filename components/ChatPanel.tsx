'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Send, Download, MessageSquare } from 'lucide-react'
import { useNegotiationStore } from '@/store/negotiation'
import { getPersona } from '@/lib/personas'
import { MessageBubble } from './MessageBubble'
import { SuggestedQuestions } from './SuggestedQuestions'
import { generateMarkdownReport } from '@/lib/download'

interface ChatPanelProps {
  onClauseHighlight: (clauseId: string) => void
  pendingQuestion: string | null
  clearPendingQuestion: () => void
}

export function ChatPanel({ onClauseHighlight, pendingQuestion, clearPendingQuestion }: ChatPanelProps) {
  const { analysis, persona } = useNegotiationStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')

  const personaObj = persona ? getPersona(persona) : null

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        personaId: persona,
        clauses: analysis?.clauses ?? [],
      },
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (pendingQuestion) {
      setInput(pendingQuestion)
      clearPendingQuestion()
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [pendingQuestion, clearPendingQuestion])

  function handleClauseClick(clauseNumber: string) {
    const clause = analysis?.clauses.find((c) => c.clauseNumber === clauseNumber)
    if (clause) onClauseHighlight(clause.id)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    sendMessage({ text })
  }

  function downloadReport() {
    if (!analysis || !personaObj) return
    const msgList = messages.map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.parts.map((p) => ('text' in p ? p.text : '')).join(''),
    }))
    const md = generateMarkdownReport(analysis.clauses, analysis.frictionScore, personaObj.name, msgList)
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'negotiation-summary.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-800">
            Negotiating with{' '}
            <span className="text-blue-600">{personaObj?.name ?? 'Opposing Counsel'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{personaObj?.style}</p>
        </div>
        {messages.length > 1 && (
          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 hover:bg-slate-50 transition-all shrink-0 ml-4"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 px-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-4 border border-slate-200">
              {personaObj?.icon ?? '⚖️'}
            </div>
            <p className="text-base font-semibold text-slate-700 mb-1">{personaObj?.name}</p>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
              {personaObj?.style}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              Ask a question or click a clause to start negotiating
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts.map((p) => ('text' in p ? p.text : '')).join('')
          return (
            <MessageBubble
              key={m.id}
              role={m.role as 'user' | 'assistant'}
              content={text}
              personaName={personaObj?.name ?? 'Opposing Counsel'}
              personaIcon={personaObj?.icon ?? '⚖️'}
              onClauseClick={handleClauseClick}
            />
          )
        })}

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0 border border-slate-200">
              {personaObj?.icon ?? '⚖️'}
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:160ms]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:320ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {analysis && (
        <SuggestedQuestions
          clauses={analysis.clauses}
          onSelect={(q) => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50) }}
        />
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 shrink-0"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a clause, propose a trade-off, or push back…"
          disabled={isLoading}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

# Redline Counsel

AI-powered contract negotiation simulator — upload two contract versions, pick an opposing-counsel persona, and get clause-by-clause risk analysis with live streaming counterproposals.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8) ![Claude](https://img.shields.io/badge/Claude-claude--sonnet--4--6-orange) ![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-streaming-black)

---

## What is Redline Counsel?

Redline Counsel is an AI negotiation co-pilot for contracts. You upload the original and redlined versions of any agreement, choose how you want the AI to argue — aggressive procurement, cautious in-house counsel, or neutral mediator — and the product gives you a clause-by-clause breakdown of every change, what it means commercially, and exactly what language to push back with.

It works on Master Service Agreements, NDAs, SaaS subscriptions, employment contracts, and any other structured legal document. No lawyers required to get started.

---

## The Problem

Contract redlining is one of the highest-friction, highest-cost steps in any deal.

- **It's slow.** A single redlined MSA can take a lawyer 3–8 hours to review properly.
- **It's expensive.** Outside counsel bills $400–$800/hour. Most startups can't afford that on every vendor contract.
- **It requires expertise most teams don't have.** Founders and BD teams often don't know which changes are dangerous and which are boilerplate.
- **The back-and-forth drags deals.** Every round of review adds days. By the time contracts close, momentum is lost.

The result: small teams either pay too much for legal review, move too fast and accept bad terms, or stall deals waiting on lawyers.

---

## The Solution

Redline Counsel gives any founder or operator the leverage of an experienced negotiating attorney — instantly.

1. Upload your original contract and the redlined version you received.
2. Choose a negotiating persona that matches your situation.
3. Get a full clause-by-clause risk analysis in seconds, with every changed clause flagged by risk level and issue type.
4. Chat live with the AI persona — it argues your position, cites specific clauses, and proposes concrete replacement language you can paste directly into a counter-redline.

No legal background required. No waiting. No $500/hour billing.

---

## How It Works

### User Journey

1. **Upload contracts** — Drop in your original and revised contract files (.txt, .md, or .pdf), or paste the text directly. Sample contracts are included so you can demo immediately.
2. **Choose a persona** — Select how the AI should argue on your behalf:
   - ⚡ **Aggressive Procurement** — Cost-focused, pushes hard on liability caps, SLA penalties, and payment terms.
   - 🛡️ **Cautious In-House** — Risk-averse, protects IP, limits indemnification exposure, preserves operational flexibility.
   - ⚖️ **Neutral Mediator** — Balanced, looks for mutual concessions and market-standard language both sides can accept.
3. **Analyze** — The app diffs the two contracts section by section, sends every changed clause to Claude for classification, and returns a friction score plus a full clause-by-clause breakdown in seconds.
4. **Review clauses** — Each changed clause is labeled by risk level (HIGH / MEDIUM / LOW) and issue type (liability, IP, payment, confidentiality, etc.) with a one-sentence plain-English summary of what changed and why it matters.
5. **Negotiate** — Open the chat panel and start negotiating. The AI stays in character as your chosen persona, cites clauses by number, argues with specific legal and business reasoning, and ends every response with a **Counterproposal** block — concrete replacement language ready to copy.
6. **Export** — Download the full negotiation session as a structured Markdown report to share with your team or hand to outside counsel.

### Technical Pipeline

```
 ┌──────────┐     ┌──────────┐     ┌────────────┐     ┌──────────┐
 │  PARSE   │────▶│   DIFF   │────▶│  CLASSIFY  │────▶│   CHAT   │
 └──────────┘     └──────────┘     └────────────┘     └──────────┘
      │                │                 │                  │
  Split both       Compare each      Single Claude      Streaming
  contracts        section by        call labels        Claude call
  into numbered    section key,      each diff:         conditioned
  SECTION blocks   extract what      issue_type,        on persona +
                   changed           risk_level,        clause context
                                     one_liner
```

- **Parse** — A custom section parser splits both contracts into numbered SECTION blocks using heading patterns. No external NLP needed.
- **Diff** — Each section is compared key-by-key. Sections that changed are extracted with their original and revised text.
- **Classify** — A single Claude API call receives all changed sections and returns a JSON array tagging each one with an issue type, risk level, and plain-English summary. This is the core intelligence of the product.
- **Chat** — A system-prompted Claude instance plays the role of the chosen persona. It has the full clause context, argues from its persona's priorities, cites clause numbers, and always ends with a concrete counterproposal.

---

## Key Features

- **Clause-by-clause diff** — Every changed section is identified and extracted automatically, with word-level inline highlighting showing exactly what was added or removed.
- **AI risk classification** — Each change is labeled HIGH / MEDIUM / LOW risk with an issue type (liability, IP rights, payment, confidentiality, termination, governing law, indemnification).
- **Friction score** — An aggregate score across all changed clauses gives you an instant read on how contentious the redline is overall.
- **Persona-conditioned negotiation** — The AI doesn't just summarize — it argues. It knows what its persona cares about, uses legal and commercial reasoning, and stays in character across the full conversation.
- **Streaming counterproposals** — Responses stream in real time. Every reply includes a formatted Counterproposal block with specific replacement language.
- **Clause citations** — The AI references specific clauses by number throughout the conversation, making it easy to track which changes are being discussed.
- **Four contract types included** — Sample MSA, NDA, SaaS subscription, and employment contracts ship with the repo for instant demos.
- **Zero-setup deployment** — One environment variable. No database, no Redis, no queues. Deploys to Vercel in one click.

---

## Demo

After setup, open [http://localhost:3000](http://localhost:3000) and click any of the sample contract buttons (MSA, NDA, SaaS, Employment) to load a pre-built contract pair. Select a persona and click **Analyze Contracts** — the full analysis runs in under 10 seconds and you're straight into the negotiation chat.

No accounts, no configuration, no sample data to prepare.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| LLM | Claude via `@ai-sdk/anthropic` |
| Streaming | Vercel AI SDK (`useChat`, `streamText`) |
| State | Zustand (no persistence) |
| Diffing | Custom section parser + key comparison |

---

## Architecture Diagram

```
User uploads                     Claude classifies
original + revised                  each diff
     │                                  │
     ▼                                  ▼
┌─────────┐   section    ┌──────┐   JSON    ┌───────────┐
│  PARSE  │─────keys────▶│ DIFF │──array───▶│ CLASSIFY  │
└─────────┘              └──────┘           └───────────┘
                                                  │
                                           ClauseChange[]
                                           + frictionScore
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │     CHAT     │◀── User message
                                          │  (streaming) │
                                          │  persona +   │──▶ Streamed response
                                          │  clause ctx  │    + Counterproposal
                                          └──────────────┘
```

---

## Quick Start

```bash
git clone https://github.com/tarak-09/redline-counsel
cd redline-counsel
npm install
cp .env.example .env.local   # paste your Anthropic API key
npm run dev
```

Get a key at **console.anthropic.com → API Keys**. Open [http://localhost:3000](http://localhost:3000) and click a sample contract to see a full demo immediately.

---

## Deployment

Deploy to Vercel with one environment variable — no database, no Redis, no additional services:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Push to GitHub, import the repo in Vercel, add the environment variable, and deploy. The app is fully serverless and scales to zero when idle.

---

## Who Is This For

- **Startups without in-house counsel** — Get a trained negotiating perspective on every vendor or customer contract before you sign.
- **Founders reviewing term sheets** — Understand which changes your counterparty made and what you should push back on, without a lawyer on retainer.
- **BD and partnerships teams** — Move faster on MSAs and NDAs without waiting days for legal review on every deal.
- **Anyone who needs to move fast on contracts** — If you're closing deals and legal turnaround is your bottleneck, Redline Counsel gives you the first line of defense.

---

## Roadmap

- [ ] Multi-turn negotiation memory (the AI remembers what concessions were already made)
- [ ] Persistent sessions — save and resume negotiations across browser sessions
- [ ] Export to Word (.docx) with tracked changes
- [ ] Side-by-side PDF viewer with diff highlights overlaid
- [ ] Clause library — save accepted counterproposal language for reuse
- [ ] Team mode — share a negotiation session and comment collaboratively

---

## License

MIT © Taraka Yarlagadda

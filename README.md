# Redline Counsel

AI-powered contract negotiation simulator. Upload two versions of a contract, choose an opposing-counsel persona, and get clause-by-clause risk analysis with live streaming counterproposals — powered by Claude.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8) ![Claude](https://img.shields.io/badge/Claude-claude--sonnet--4--6-orange) ![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-streaming-black)

## Quick start

```bash
git clone https://github.com/your-username/redline-counsel
cd redline-counsel
npm install
cp .env.example .env.local   # paste your Anthropic API key
npm run dev
```

Get a key at **console.anthropic.com → API Keys**. Open [http://localhost:3000](http://localhost:3000) and click a sample contract to see a full demo immediately.

## Architecture

```
parse → diff → classify → chat

1. parse     Split both contracts into numbered SECTION blocks
2. diff      Compare sections key-by-key, extract what changed
3. classify  Single Claude call labels each diff: issue_type, risk_level, one_liner
4. chat      Streaming Claude responses from a persona-conditioned system prompt
             with clause citations and counterproposal blocks
```

## Why this exists

Contract redlines are one of the highest-friction parts of any deal. Lawyers spend hours manually reviewing clause-by-clause changes without a clear picture of which changes are risky and what counterproposal language to offer. Redline Counsel gives any negotiator an AI sparring partner that argues from a specific persona, cites clauses by number, and proposes concrete replacement language — turning a passive document review into an active negotiation simulation.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| LLM | Claude via `@ai-sdk/anthropic` |
| Streaming | Vercel AI SDK (`useChat`, `streamText`) |
| State | Zustand (no persistence) |
| Diffing | Custom section parser + key comparison |

## Deployment

Deploy to Vercel with one environment variable — no database, no Redis, no additional services:

```
ANTHROPIC_API_KEY=sk-ant-...
```

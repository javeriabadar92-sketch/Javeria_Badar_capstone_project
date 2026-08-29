# ProjectPilot AI

**From idea to implementation—all in one AI-powered workspace.**

## Project Brief

ProjectPilot AI helps Software Engineering students and beginner developers turn a single project idea into a complete, structured software project plan — requirements, user stories, suggested features, a development roadmap, and a Kanban task board — instead of juggling ChatGPT, Notion, Trello, and Figma separately. It's built for students working on capstone or personal projects who need a fast, organized starting point without spending hours setting up planning documents by hand. I chose this idea because I experienced this exact problem while building my own capstone project, and wanted a tool that turns AI's raw text output into an actual usable, editable workspace rather than another chat window.

## Live Application

🔗 **Live URL:** https://projectpilot-ai-jb.vercel.app/

## Repository

🔗 **GitHub:** https://github.com/javeriabadar92-sketch/Javeria_Badar_capstone_project

## Setup & Run Instructions

```bash
git clone https://github.com/javeriabadar92-sketch/Javeria_Badar_capstone_project.git
cd Javeria_Badar_capstone_project
npm install
```

Create a `.env` file in the root with:
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

Run the app locally (this starts both the Express API server and the Vite dev server together):
```bash
npm run dev:full
```

Visit `http://localhost:5173`.

## Architecture Overview

- **`src/pages/`** — Route-level pages: Landing (idea input), Overview, Requirements, User Stories, Features, Roadmap, Kanban Board, Notes, Chat, Health Check
- **`src/components/`** — Reusable UI: Layout (sidebar navigation), PageHeader, EditableList, PriorityTag, ProjectSwitcher, PlanGenerationSkeleton, PlanEmptyState
- **`src/context/PlanContext.tsx`** — Central state management for the generated plan, multiple saved projects (persisted to `localStorage`), and all plan-editing actions (add/edit/delete requirements, user stories, features; regenerate plan; switch/delete projects)
- **`src/playground/`** — Hand-built accessible components (Modal, Tabs, Disclosure) built from scratch against W3C ARIA patterns, as a learning exercise before using AI-generated components elsewhere
- **`api/chat.ts`** — Vercel Edge Function that streams responses from Google Gemini using the AI SDK
- **`server.js`** — Express server mirroring the same `/api/chat` logic, used for local development since Vite doesn't run serverless functions natively
- **Review & progress tracking** — Requirements, User Stories, and Features items can be marked as reviewed; reviewed items move to a "Done" section within the same page (not a separate route), with a brief celebratory toast confirmation
- **Per-project notes** — Notes are scoped to each saved project individually and support multiple saved entries with timestamps, rather than a single overwritable note

## AI Integration Explained

The app uses **Google's Gemini API** (`gemini-3.5-flash-lite`) via the Vercel AI SDK's `streamText` function, streamed to the client with the `useChat` hook. Three distinct system prompts are used depending on context (general chat, structured plan generation, acceptance criteria generation), selected via a `mode` field sent with each request.

**Two AI-powered flows:**
1. **Plan generation** — When a user submits a project idea, a structured system prompt instructs Gemini to return strict JSON matching a defined shape (overview, requirements, user stories, features, roadmap, kanban tasks). The response is parsed and normalized into the app's data model.
2. **Acceptance criteria generation** — On the User Stories page, a user can request 3-4 AI-generated acceptance criteria for a specific story, using a second, smaller prompt scoped to just that story.
3. **Streaming chat** — A general chat interface (`/chat`) demonstrates token-by-token streaming, a stop button, and conversation state across multiple turns.

I chose Gemini over Claude for this project mainly for its generous free tier during development, and because the AI SDK made switching providers straightforward — the same `streamText`/`useChat` pattern would work with Claude with minimal changes to `api/chat.ts`.

## Known Limitations & Future Improvements

- The AI occasionally returns malformed JSON for very vague or very long project ideas, which surfaces as a generation error rather than a partial/degraded plan
- No user accounts — all projects are stored in `localStorage`, so switching browsers or clearing site data loses saved projects
- The Kanban board uses simple status buttons rather than full drag-and-drop
- Gemini's free tier occasionally returns a temporary `503` "model overloaded" error under high demand — the app handles this with a friendly error message and retry suggestion, but doesn't auto-retry
- Future improvement: persist projects to a real backend/database instead of `localStorage` so plans survive across devices

## Testing Evidence

10 unit tests across 2 components (Disclosure and PriorityTag), covering rendering, keyboard/click interaction, ARIA attribute correctness, and toggle behavior — using Vitest + React Testing Library.

✓ src/components/PriorityTag.test.tsx (5 tests) 361ms
✓ src/playground/Disclosure.test.tsx (5 tests) 621ms

Test Files 2 passed (2)
Tests 10 passed (10)

Run tests locally with:
```bash
npm run test
```

## Performance & Accessibility Audit

**Lighthouse (mobile, incognito):**
| Category | Score |
|---|---|
| Performance | 94 |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 91 |

**axe DevTools (WCAG 2.1 AA):** 0 violations found.

**One concrete improvement made from audit findings:** The initial SEO score was 82 due to a missing `<meta name="description">` and generic `<title>` tag left over from the Vite starter template. Adding a descriptive title, meta description, and Open Graph tags to `index.html` raised the SEO score to 91.

## Deployment & Operation

**Deployment checklist:**
- [x] Environment variable `GOOGLE_GENERATIVE_AI_API_KEY` set in Vercel project settings (Production environment)
- [x] `.env` and `.env.local` excluded via `.gitignore`; only `.env.example` (placeholder values) is committed
- [x] `npm run build` passes with no TypeScript errors before every deploy
- [x] Verified the live URL loads correctly and the AI plan-generation flow works end-to-end post-deploy
- [x] Confirmed automatic deployments trigger on every push to `main` via Vercel's Git integration

**How it fails safely:** API errors (rate limits, model overload, malformed AI output) are caught and shown as a styled error card with a human-readable message — the app never crashes to a blank screen or shows a raw stack trace to the user.

**Rollback plan:** Since deployments are Git-connected, rolling back means either (a) reverting the problematic commit locally and pushing (`git revert <commit> && git push`), or (b) using Vercel's dashboard to instantly re-promote a previous successful deployment to production, without needing to touch the code.

## Reflection

The hardest part of this capstone was debugging the streaming chat feature — a single missing line (`export const config = { runtime: 'edge' }`) caused requests to hang silently with no error message for a long stretch of debugging, and later a deprecated Gemini model name caused a similarly opaque failure. Both taught me that with AI SDKs, "it's just hanging" is almost never a mystery — it's nearly always a specific, checkable cause (runtime mismatch, model availability, or a malformed response), and the fix is to isolate each layer (API key, model name, server code, client code) with a direct test rather than guessing at the whole system at once.

If I did this differently next time, I'd set up a minimal end-to-end streaming test (a plain `curl` request to the model, bypassing my own code entirely) *before* wiring up the full UI, since that would have caught the model-deprecation issue in seconds instead of hours.

The thing that surprised me most was how much of "good AI integration" is actually about constraint and verification rather than the AI call itself — a vague prompt to an AI coding assistant produced a settings form with an unrequested, security-sensitive API key field, while a precise prompt with explicit exclusions and a test-writing step produced exactly what was needed. The AI's raw capability mattered far less than how specifically I directed it.
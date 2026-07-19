# Project Rules — ProjectPilot AI

## Stack
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS (planned)
- AI Integration: OpenAI API for generating project plans, docs, and task breakdowns

## Conventions
- Use Conventional Commits (feat:, fix:, docs:, chore:, etc.)
- Components in PascalCase, files in kebab-case
- Keep components small and single-responsibility

## Purpose
ProjectPilot AI helps Software Engineering students turn a simple project idea into a structured plan — covering documentation, task management, and UI inspiration — inside one AI-powered workspace, instead of juggling ChatGPT, Notion, Trello, and Figma separately.

## Lessons Learned (from vague vs precise prompting drill)
- Settings/form prompts must include an explicit field allow-list (e.g. "only 
  Project Name and Project Description — no other fields") — without this, the AI will invent unrequested fields, including sensitive ones like API key inputs.

- Every validation feature request must include "write unit tests for this logic and run them" in the same prompt — untested validation code silently skips edge cases like whitespace-only input and boundary values.

- Accessibility attributes (proper <label>, aria-invalid) and interaction details (hover states, transition timing) must be named explicitly in the prompt — they are not added by default even when the rest of the UI is polished.
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
- Always explicitly state which fields/features to INCLUDE and EXCLUDE — 
  vague prompts led the AI to invent unrequested fields, including a security-
  sensitive API key input that should never have been added without explicit request.
- Always ask the AI to write and run tests for validation logic as part of the 
  same prompt — this catches edge cases (whitespace-only input, boundary values) 
  that get silently skipped when verification isn't explicitly requested.
- Explicitly specify accessibility requirements (labels, aria-invalid) and visual 
  details (hover effects, transitions) upfront — the AI does not proactively 
  ensure polish or accessibility unless asked directly.
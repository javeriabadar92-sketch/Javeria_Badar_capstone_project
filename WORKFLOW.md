# WORKFLOW.md — Vague vs Precise Prompting Comparison

## Overview
This document compares two approaches to building the same feature — a project settings form with validation — using a single vague prompt (Round 1) versus a detailed, constraint-driven prompt with a verification step (Round 2).

## Round 1: Vague Prompt
**Prompt used:** "make me a settings form with validation"

The AI generated a form with fields that were never requested: Display Name, 
Email, Bio (500 char limit), Timezone, Theme selector, notification checkboxes, and — most notably — an **OpenAI API key input field**, storing it as plain text locally. This is a significant AI mistake: without explicit constraints,the AI invented an entire "AI Integration" section, including a security-sensitive credential field that was never part of the actual requirement. This kind of unconstrained scope creep could easily introduce a real security risk if shipped without review.

**Correctness:** Basic validation existed — submitting empty required fields did show an error message, so the core validation loop technically worked.

**Accessibility:** Labels were present but heading sizing/typography was inconsistent, suggesting the AI didn't carefully consider visual hierarchy.

**Edge cases:** Not explicitly tested — no evidence the AI considered whitespace-only input, character limits, or paste-overflow scenarios, since these weren't specified.

**Review effort:** High. The entire scope needed to be reviewed and the unrequested API key field needed to be removed entirely before this could be considered safe 
to merge.

## Round 2: Precise Prompt
The prompt explicitly specified: exact fields (Project Name, Project Description), character limits, required vs optional rules, explicit exclusion of any API-related fields, accessibility requirements (labels, aria-invalid), specific edge cases to handle (empty, whitespace-only, exact limits, paste overflow), hover/transition styling requirements, and a verification step asking the AI to write and run tests.

**Correctness:** The AI wrote 13 unit tests covering exactly the specified edge cases (minimum/maximum length, whitespace-only names, exact boundary values) — all 13 passed on the first run.

**Accessibility:** Proper `<label>` elements and `aria-invalid` attributes were included as explicitly requested.

**Edge cases:** All edge cases named in the prompt were handled and covered by tests — a direct result of naming them explicitly rather than leaving them to the AI's judgment.

**Review effort:** Low. Because the constraints were explicit and verified by 
tests, review consisted of skimming test output rather than manually checking 
every behavior.

## Key Takeaway
The single biggest difference wasn't code style — it was scope control. The vague prompt let the AI improvise an entire unrequested feature area (including a security-sensitive field), while the precise prompt with explicit constraints and a test-driven verification step produced exactly the specified behavior with proof it worked.

## Time Comparison
Round 1 took under a minute to prompt, but required significant follow-up time to manually review and strip out the unrequested fields (Display Name, Email, Bio, Timezone, Theme, Notifications, and the API key field) before the form could be considered usable. Round 2 took longer to write the initial prompt — several minutes to specify fields, constraints, and verification requirements — but required close to zero rework afterward, since the AI's output matched the requirement exactly and was backed by 13 passing tests. End-to-end, Round 2 was faster despite the slower start, because none of that time was spent on review and correction.

Round 1 and Round 2 were also run in separate sessions/environments (Round 1 in Cursor, Round 2 after switching to VS Code), which kept the two prompts fully independent — Round 2 was not influenced by any context carried over from Round 1.
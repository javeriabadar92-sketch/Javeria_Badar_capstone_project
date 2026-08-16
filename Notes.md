# NOTES.md — Comparing Hand-Built Components vs shadcn/ui

## Gap 1: Portal Rendering
My Modal component renders its JSX inline, wherever the component is called in the tree. shadcn's Dialog wraps its content in a `<DialogPortal>`, which renders the modal's DOM elsewhere (effectively at the document root). This matters in real apps because a parent element with `overflow: hidden` or a constrained `z-index` stacking context could visually clip or bury my modal, while shadcn's portal-based approach avoids that entirely regardless of where the trigger button lives in the component tree.

## Gap 2: Explicit Focus-Visible Styling
shadcn's Tabs component includes explicit `focus-visible` ring styles (`focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1`) so keyboard users get a clear, consistent visual indicator of which tab is focused. My version relies on the browser's default focus outline, which is inconsistent across browsers and easy to accidentally override with CSS elsewhere in an app. This is a real accessibility gap — my components are keyboard-operable, but the *visual feedback* for keyboard users is weaker than shadcn's.

## Additional Observation
shadcn's components are built on top of `@base-ui/react`, a headless accessibility primitives library. Most of the actual keyboard-interaction and ARIA logic (roving tabindex, focus management) is implemented inside that library, not in shadcn's own code — shadcn primarily adds styling and composition on top. Building my three components manually made this visible: a huge amount of correct accessibility behavior is normally "hidden" inside libraries that most developers never read, which is exactly why this drill was useful before trusting AI-generated components.
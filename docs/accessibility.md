# Accessibility Baseline (P0)

Goal: Ensure SambhidanX is usable with keyboard, screen readers, and varied contrast needs from the earliest phases.

## Principles
- Perceivable: Text alternatives for non-text content; sufficient contrast.
- Operable: Full keyboard navigation; no keyboard traps; focus order logical.
- Understandable: Consistent navigation patterns; clear labels; predictable interactions.
- Robust: Semantic HTML + ARIA only where needed; test with common screen readers.

## Immediate P0 Checklist
- [ ] Semantic headings hierarchy (`h1` per page, descending order)
- [ ] Landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Focus outline never removed without replacement
- [ ] Skip-to-content link at top of page
- [ ] Buttons use `<button>` elements, not divs
- [ ] Interactive icons have `aria-label` or text
- [ ] Images: `alt` attribute always present (empty only if decorative)
- [ ] Form fields: associated `<label for>` or wrapped label
- [ ] Color contrast ≥ WCAG AA (use automated check in CI later)

## Near-Term (P1)
- Announce dynamic quiz result updates via `aria-live="polite"`
- Provide visible focus states for navigation and quiz options
- Provide keyboard shortcuts (optional) for answer selection (1–4)
- Error messaging: programmatically associated with inputs via `aria-describedby`

## Testing Strategy
- Manual keyboard traversal (Tab, Shift+Tab, Enter, Space, Arrow keys where relevant)
- Lighthouse accessibility audit (CI snapshot metric)
- Spot NVDA / VoiceOver checks on representative pages (Lesson, Quiz, Dashboard)

## Anti-Patterns to Avoid
- Using `role="button"` on clickable `<div>` instead of real button
- Hiding focus outline globally via `outline: none` without custom focus style
- Injecting large blocks of text into `aria-live` regions unnecessarily

## Future Enhancements
- User preference toggles: font size scaling, dyslexia-friendly font option
- Dark mode contrast verification
- Reduced motion preference respected for animations

Document version: v0.1

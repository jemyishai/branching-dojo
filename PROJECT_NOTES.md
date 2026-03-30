# Project Notes — Bridge Shape Dojo

Concise summary for an AI assistant picking up this project. Last updated March 2026.

---

## What This Is

A browser-based C++ learning tool for students practicing nested `for` loops by generating star patterns. 100% client-side, no build step, no server, works offline. Hosted on GitHub Pages.

**Audience**: Beginning CS students, likely on school wifi with unreliable connections.

---

## What Works (Current State)

- 17 star patterns with generators and per-pattern text hints
- Custom C++ interpreter (browser JS — not a real compiler)
- Visual diff: student output vs expected, mismatched lines highlighted
- Dual theme (Classic / Matrix), persists to localStorage
- Toggleable linter with educational suggestions
- **Progress tracking** — `ProgressTracker` class in `js/progress.js`; stores attempts + completions per pattern in localStorage (`dojo-progress`); sidebar shows checkmarks and a `5/17` style counter; reset option available
- **Inline for() loop ghost hints** — `getForLoopHint()` in `ai-assistant.js` reads cursor position; `FOR_PART_HINTS` table maps loop parts (init/condition/increment) to contextual tips; ghost hint line renders below the editor
- **Mobile/tablet layout** — collapsible sidebar, 48px touch targets, overflow fixes; grid stacks at 768px breakpoint
- **AI features (all rule-based, instant)**:
  - Hint panel shows loop structure template for the selected pattern
  - Cursor-aware hints update as student types (debounced 500ms)
  - "Explain My Code" button gives plain-English loop breakdown
  - Smarter mistake hints: upside-down, row count, spaces, hollow/solid, star count

---

## What Does NOT Work / Is Not Built

- No LLM or model inference — Transformers.js was removed intentionally
- No code autocomplete / inline suggestions
- No backend of any kind
- The C++ interpreter is educational-only — `while`, `do-while`, functions, arrays, STL, `cin` are unsupported

---

## Key Files

| File | Purpose |
|---|---|
| `js/ai-assistant.js` | All AI features: cursor hints, ghost hints, explain, mistake detection |
| `js/main.js` | App orchestrator — run/explain/feedback/event wiring |
| `js/patterns.js` | 17 pattern generators + text hints |
| `js/progress.js` | `ProgressTracker` class — localStorage progress, onChange listeners |
| `cpp-interpreter.js` | C++ subset interpreter (~800 lines) |
| `js/ui-components.js` | Diff engine and rendering utilities |

---

## Next Steps (Most Valuable)

1. **More pattern-specific mistake hints** — extend `getMistakeHint()` in `ai-assistant.js` with per-pattern rules beyond the current generic checks
2. **Better C++ interpreter coverage** — add `while`, `do-while`, basic void functions; unblocks a wider class of student solutions
3. **Challenge mode** — hide expected output so the student must figure it out; toggle in sidebar
4. **Keyboard shortcuts** — Ctrl+Enter already runs code; add Ctrl+R to reset editor, document all shortcuts in UI
5. **Accessibility** — screen reader labels on pattern buttons, focus management after Run, ARIA live region for output
6. **Teacher/shareable view** — encode progress + selected pattern in URL query string (no backend needed); allows sharing a prefilled exercise link

---

## Constraints

- No server, no API keys, no build tools — all changes are edit-and-refresh
- School wifi — no large downloads, no CDN model loading
- Educational tone — hints teach, they don't solve
- Don't break existing patterns or interpreter behavior

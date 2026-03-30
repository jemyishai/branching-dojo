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
- **AI features (all rule-based, instant)**:
  - Hint panel shows loop structure template for the selected pattern
  - Cursor-aware hints update as student types (debounced 500ms)
  - "Explain My Code" button gives plain-English loop breakdown
  - Smarter mistake hints: upside-down, row count, spaces, hollow/solid, star count

---

## What Does NOT Work / Is Not Built

- No LLM or model inference — Transformers.js was removed intentionally
- No code autocomplete / inline suggestions
- No progress tracking or user accounts
- No backend of any kind
- The C++ interpreter is educational-only — `while`, functions, arrays, STL, cin are unsupported

---

## Key Files

| File | Purpose |
|---|---|
| `js/ai-assistant.js` | All AI features: cursor hints, explain, mistake detection |
| `js/main.js` | App orchestrator — run/explain/feedback/event wiring |
| `js/patterns.js` | 17 pattern generators + text hints |
| `cpp-interpreter.js` | C++ subset interpreter (~800 lines) |
| `js/ui-components.js` | Diff engine and rendering utilities |

---

## Next Steps (Most Valuable)

1. **More detailed mistake hints** — the current `getMistakeHint()` in `ai-assistant.js` covers the most common cases; could be extended with more pattern-specific rules
2. **Track success per pattern** — localStorage, no server needed
3. **Inline loop bound suggestions** — show a tooltip/ghost text when cursor is inside a `for (` expression
4. **Better mobile UX** — hint panel and editor side-by-side on tablet

---

## Constraints

- No server, no API keys, no build tools — all changes are edit-and-refresh
- School wifi — no large downloads, no CDN model loading
- Educational tone — hints teach, they don't solve
- Don't break existing patterns or interpreter behavior

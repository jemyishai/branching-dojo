# Bridge Shape Dojo

An interactive C++ learning platform for teaching nested loops through visual star-pattern exercises. Students write C++ code, run it in the browser, and get instant visual feedback comparing their output to the expected pattern. Works fully offline — no install, no build step, no internet required.

## Features

### Learning Tools
- **17 Star Patterns** — triangles, pyramids, squares, and diamonds with increasing complexity
- **Pattern-Specific Hints** — collapsible hint panel shows the exact loop structure for each pattern
- **Cursor-Aware Hints** — while typing with the hint panel open, hints update based on where your cursor is (outer loop, inner loop, cout line, etc.)
- **Explain My Code** — click the **Explain ✦** button for a plain-English breakdown of what your loops do
- **Smarter Feedback** — when output doesn't match, you get a specific reason: upside-down triangle, wrong row count, missing spaces, hollow vs. solid mismatch, off-by-one star counts
- **Visual Diff** — your output and the expected pattern are shown side-by-side with mismatched lines highlighted
- **Linting** — toggleable C++ syntax checker with educational suggestions
- **Clean Reset** — clears the editor back to the default boilerplate

### Themes
- **Dojo Classic** — light blue professional theme
- **Dojo Matrix** — dark neon theme with green accents
- Auto-detects system preference; saves your choice to localStorage

### Technical
- **Custom C++ Interpreter** — browser-based execution of a C++ subset (no compilation)
- **100% Client-Side** — no server, no API keys, no internet required
- **Modular Architecture** — separate files for state, patterns, linting, UI, and AI
- **Responsive** — works on mobile; sticky compact header on scroll

## Supported C++ Subset

The interpreter supports an educational subset of C++:
- `#include <iostream>` / `using namespace std;` (parsed but not required)
- Variable declarations: `int`, `char`
- `for` loops with standard syntax
- Assignment: `=`, `+=`, `++` (pre/post), `--`
- `cout << ... << "\n";` / `cout << endl;`
- Basic arithmetic and character code arithmetic

Things that will **not** work: `while`/`do-while`, functions, arrays, STL, pointers, `cin`.

## How to Use

1. Open `index.html` in any modern web browser
2. Choose a pattern from the dropdown (patterns 1–17 increase in difficulty)
3. Set `N` — the size of the pattern (default 5)
4. Look at the **Expected Pattern** to understand your target
5. Click **Hint** to see the loop structure guidance
6. Write C++ code in the editor
7. Click **Run ▶** (or Cmd/Ctrl+Enter) to execute and compare
8. If your output is wrong, read the specific feedback hint below the output
9. Click **Explain ✦** anytime to get a plain-English description of what your code is doing
10. Click **Reset** to start fresh with a clean boilerplate

## Architecture

```
index.html            — app shell, header, pattern select, editor, output
styles.css            — dual-theme system (Classic + Matrix) via CSS variables
cpp-interpreter.js    — tokenizer → parser → AST → interpreter (~800 lines)
js/
  app-state.js        — reactive pub/sub state management
  patterns.js         — 17 pattern generators + per-pattern text hints
  linter.js           — educational C++ lint checks
  ui-components.js    — DOM utilities, diff engine, rendering
  main.js             — app orchestrator, event wiring, run/explain/feedback
  ai-assistant.js     — rule-based AI: cursor hints, code explanation, mistake diagnosis
```

## AI Features (Fully Rule-Based, No Downloads)

All AI features are instant and offline. There is no model download.

| Feature | How it works |
|---|---|
| **AI Ready badge** | Shows immediately on page load |
| **Loop structure hints** | Per-pattern step-by-step templates in `PATTERN_FALLBACKS` |
| **Cursor-aware hints** | Detects loop level, line type, nesting — updates as you type |
| **Explain My Code** | Parses `for` loop bounds, direction, and `cout` output |
| **Mistake detection** | Analyzes row count, direction, leading spaces, star counts, hollow/solid |

## Pattern List

| # | Name | Key Concept |
|---|------|-------------|
| 1 | Left Triangle | `j <= i` inner bound |
| 2 | Hollow Left Triangle | border condition (`j==1 \|\| j==i \|\| i==N`) |
| 3 | Downward Left Triangle | outer loop counts down |
| 4 | Downward Hollow Left | down + border |
| 5 | Right Triangle | leading spaces (`N-i`) |
| 6 | Hollow Right Triangle | spaces + border stars |
| 7 | Downward Right Triangle | down + leading spaces |
| 8 | Downward Hollow Right | down + spaces + border |
| 9 | Pyramid | spaces + `2*i-1` stars |
| 10 | Hollow Pyramid | pyramid + border only |
| 11 | Downward Pyramid | down pyramid |
| 12 | Downward Hollow Pyramid | down + hollow |
| 13 | Square | both loops 1→N |
| 14 | Hollow Square | border condition on i and j |
| 15 | Crossed Square | border + diagonal (`i==j \|\| i+j==N+1`) |
| 16 | Diamond | two loop blocks (up + down) |
| 17 | Hollow Diamond | hollow up + hollow down |

## Credits

Made by Jess. AI features added in Phase 2 (2026).

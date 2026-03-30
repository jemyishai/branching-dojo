// AI Assistant for Bridge Shape Dojo — Phase 2: Rule-Based Intelligence
// No model downloads. All hints are instant, offline, and school-wifi safe.

// ---------------------------------------------------------------------------
// Educational code-structure hints — detailed, step-by-step per pattern
// ---------------------------------------------------------------------------
const PATTERN_FALLBACKS = {
  left: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= i; j++)\n        cout << "* ";\n    cout << "\\n";\n}',
    tip: 'Outer loop = rows (1→N). Inner loop runs j from 1 to i — row i gets exactly i stars.'
  },
  hleft: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= i; j++) {\n        if (j==1 || j==i || i==N) cout << "* ";\n        else cout << "  ";\n    }\n    cout << "\\n";\n}',
    tip: 'Star only on borders: j==1 (left edge), j==i (right edge), or i==N (bottom row fills solid).'
  },
  dleft: {
    loops: 'for (int i = N; i >= 1; i--) {\n    for (int j = 1; j <= i; j++)\n        cout << "* ";\n    cout << "\\n";\n}',
    tip: 'Same as left triangle but count the outer loop DOWN from N to 1.'
  },
  dhleft: {
    loops: 'for (int i = N; i >= 1; i--) {\n    for (int j = 1; j <= i; j++) {\n        if (j==1 || j==i || i==N) cout << "* ";\n        else cout << "  ";\n    }\n    cout << "\\n";\n}',
    tip: 'Downward hollow: outer loop counts DOWN. Star only on borders (j==1, j==i, or i==N).'
  },
  right: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= N-i; j++) cout << "  "; // spaces\n    for (int j = 1; j <= i; j++)   cout << "* "; // stars\n    cout << "\\n";\n}',
    tip: 'Each row needs (N-i) spaces BEFORE the stars. Use a separate inner loop for spaces.'
  },
  hright: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= N-i; j++) cout << "  "; // spaces\n    for (int j = 1; j <= i; j++) {\n        if (j==1 || j==i || i==N) cout << "* ";\n        else cout << "  ";\n    }\n    cout << "\\n";\n}',
    tip: 'Hollow right: print spaces, then star only if j==1 or j==i. Bottom row (i==N) is solid.'
  },
  dright: {
    loops: 'for (int i = N; i >= 1; i--) {\n    for (int j = 1; j <= N-i; j++) cout << "  "; // spaces\n    for (int j = 1; j <= i; j++)   cout << "* "; // stars\n    cout << "\\n";\n}',
    tip: 'Same as right triangle but count the outer loop DOWN from N to 1.'
  },
  dhright: {
    loops: 'for (int i = N; i >= 1; i--) {\n    for (int j = 1; j <= N-i; j++) cout << "  "; // spaces\n    for (int j = 1; j <= i; j++) {\n        if (j==1 || j==i || i==N) cout << "* ";\n        else cout << "  ";\n    }\n    cout << "\\n";\n}',
    tip: 'Hollow downward right: outer loop counts down, border stars only.'
  },
  pyr: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= N-i; j++) cout << "  "; // spaces\n    for (int j = 1; j <= 2*i-1; j++) cout << "* "; // stars\n    cout << "\\n";\n}',
    tip: 'Row i: print (N-i) spaces, then (2*i-1) stars. Star count is always odd (1,3,5...).'
  },
  hpyr: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= N-i; j++) cout << "  "; // spaces\n    for (int j = 1; j <= 2*i-1; j++) {\n        if (j==1 || j==2*i-1 || i==N) cout << "* ";\n        else cout << "  ";\n    }\n    cout << "\\n";\n}',
    tip: 'Hollow pyramid: star only at position j==1 or j==2*i-1 (the two edges). Middle is spaces.'
  },
  dpyr: {
    loops: 'for (int i = N; i >= 1; i--) {\n    for (int j = 1; j <= N-i; j++) cout << "  "; // spaces\n    for (int j = 1; j <= 2*i-1; j++) cout << "* "; // stars\n    cout << "\\n";\n}',
    tip: 'Same formula as pyramid but outer loop counts DOWN from N to 1.'
  },
  hdpyr: {
    loops: 'for (int i = N; i >= 1; i--) {\n    for (int j = 1; j <= N-i; j++) cout << "  "; // spaces\n    for (int j = 1; j <= 2*i-1; j++) {\n        if (j==1 || j==2*i-1 || i==N) cout << "* ";\n        else cout << "  ";\n    }\n    cout << "\\n";\n}',
    tip: 'Hollow downward pyramid: outer loop counts down, border stars only.'
  },
  sq: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= N; j++)\n        cout << "* ";\n    cout << "\\n";\n}',
    tip: 'Square: always N stars per row, N rows total. Both loops go from 1 to N — no conditions needed.'
  },
  hsq: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= N; j++) {\n        if (i==1 || i==N || j==1 || j==N) cout << "* ";\n        else cout << "  ";\n    }\n    cout << "\\n";\n}',
    tip: 'Star if on any border: top (i==1), bottom (i==N), left (j==1), or right (j==N).'
  },
  xsq: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= N; j++) {\n        bool border = (i==1 || i==N || j==1 || j==N);\n        bool diag   = (i==j || i+j==N+1);\n        if (border || diag) cout << "* ";\n        else cout << "  ";\n    }\n    cout << "\\n";\n}',
    tip: 'Crossed square: star if on any border OR on either diagonal (i==j or i+j==N+1).'
  },
  dia: {
    loops: '// Upper half (rows 1 to N):\nfor (int i = 1; i <= N; i++) {\n    // (N-i) spaces, then (2*i-1) stars\n}\n// Lower half (rows N-1 down to 1):\nfor (int i = N-1; i >= 1; i--) {\n    // (N-i) spaces, then (2*i-1) stars\n}',
    tip: 'Diamond = upward pyramid + downward pyramid. Write two separate for loops, one after the other.'
  },
  hdia: {
    loops: '// Upper half — hollow pyramid:\nfor (int i = 1; i <= N; i++) { ... }\n// Lower half — hollow downward pyramid:\nfor (int i = N-1; i >= 1; i--) { ... }',
    tip: 'Hollow diamond: same two-loop structure as solid diamond, but add border conditions per row.'
  },
  _default: {
    loops: 'for (int i = 1; i <= N; i++) {\n    for (int j = 1; j <= ...; j++)\n        cout << "* ";\n    cout << "\\n";\n}',
    tip: 'Outer loop = rows (i), inner loop = items per row (j). End each row with cout << "\\n";'
  }
};

// ---------------------------------------------------------------------------
// Per-pattern for-loop part suggestions (init / condition / increment)
// Used by the inline loop-bound ghost hint feature
// ---------------------------------------------------------------------------
const FOR_PART_HINTS = {
  left:    { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= i',     incr:'j++' } },
  hleft:   { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= i',     incr:'j++' } },
  dleft:   { outer: { init:'int i = N', cond:'i >= 1',     incr:'i--' }, inner: { init:'int j = 1', cond:'j <= i',     incr:'j++' } },
  dhleft:  { outer: { init:'int i = N', cond:'i >= 1',     incr:'i--' }, inner: { init:'int j = 1', cond:'j <= i',     incr:'j++' } },
  right:   { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= N-i',   incr:'j++' } },
  hright:  { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= i',     incr:'j++' } },
  dright:  { outer: { init:'int i = N', cond:'i >= 1',     incr:'i--' }, inner: { init:'int j = 1', cond:'j <= N-i',   incr:'j++' } },
  dhright: { outer: { init:'int i = N', cond:'i >= 1',     incr:'i--' }, inner: { init:'int j = 1', cond:'j <= i',     incr:'j++' } },
  pyr:     { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= 2*i-1', incr:'j++' } },
  hpyr:    { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= 2*i-1', incr:'j++' } },
  dpyr:    { outer: { init:'int i = N', cond:'i >= 1',     incr:'i--' }, inner: { init:'int j = 1', cond:'j <= 2*i-1', incr:'j++' } },
  hdpyr:   { outer: { init:'int i = N', cond:'i >= 1',     incr:'i--' }, inner: { init:'int j = 1', cond:'j <= 2*i-1', incr:'j++' } },
  sq:      { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= N',     incr:'j++' } },
  hsq:     { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= N',     incr:'j++' } },
  xsq:     { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= N',     incr:'j++' } },
  dia:     { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= 2*i-1', incr:'j++' } },
  hdia:    { outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= 2*i-1', incr:'j++' } },
  _default:{ outer: { init:'int i = 1', cond:'i <= N',     incr:'i++' }, inner: { init:'int j = 1', cond:'j <= ...',   incr:'j++' } },
};

// ---------------------------------------------------------------------------
// Cursor-level context messages shown while the student is typing
// ---------------------------------------------------------------------------
const CURSOR_HINTS = {
  outerLoop:   'This is your outer loop — it controls how many rows are printed. Try: for (int i = 1; i <= N; i++)',
  innerLoop:   'This is your inner loop — it controls how many items appear per row. The bound often involves the outer variable (i).',
  cout:        'cout << "* "; prints one star. After your inner loop, add cout << "\\n"; to move to the next row.',
  insideOuter: 'You\'re inside the outer loop. Add your inner for loop here, then cout << "\\n"; after it to end each row.',
  insideInner: 'You\'re inside the inner loop body. Put your cout << "* "; (or cout << "  ";) statement here.'
};

// ---------------------------------------------------------------------------
// AIAssistant — fully rule-based, instant, no downloads
// ---------------------------------------------------------------------------
class AIAssistant {
  constructor() {
    this.status = 'idle';
    this._msg   = '';
    this._cbs   = [];
  }

  // Register a status-change listener; fires immediately with current status
  onStatus(cb) {
    this._cbs.push(cb);
    if (this.status !== 'idle') cb(this.status, this._msg);
  }

  _emit(status, msg) {
    this.status = status;
    this._msg   = msg;
    this._cbs.forEach(cb => cb(status, msg));
  }

  // No model to load — emit ready immediately
  initialize() {
    this._emit('ready', 'AI Ready');
  }

  // -------------------------------------------------------------------------
  // getHint — returns the loop-structure hint for the hint panel
  // -------------------------------------------------------------------------
  getHint(code, patternKey) {
    return this._fallbackHint(patternKey);
  }

  // -------------------------------------------------------------------------
  // getCursorHint — context-aware hint based on where the cursor is
  // Returns { type, text, isCode, tip? }
  // -------------------------------------------------------------------------
  getCursorHint(code, cursorPos, patternKey) {
    const lines = code.split('\n');

    // Find which line the cursor is on
    let charCount = 0, cursorLine = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1; // +1 for the \n
      if (charCount >= cursorPos) { cursorLine = i; break; }
    }

    const currentLine = lines[cursorLine] || '';
    const trimmed     = currentLine.trim();

    // Skip boilerplate lines — not worth hinting on
    if (/^(#|using|int main|return\s+0;?\s*$|\{$|\}$)/.test(trimmed) || trimmed === '') {
      return this._fallbackHint(patternKey);
    }

    // Count for loops strictly before the cursor line (by line number)
    const forLoopsBeforeLine = lines
      .slice(0, cursorLine)
      .filter(l => /\bfor\s*\(/.test(l)).length;

    // Determine nesting level at the start of the cursor line
    let nestLevel = 0;
    for (let i = 0; i < cursorLine; i++) {
      nestLevel += (lines[i].match(/\{/g) || []).length;
      nestLevel -= (lines[i].match(/\}/g) || []).length;
    }

    const isForLoop = /^\s*for\s*\(/.test(currentLine);
    const isCout    = trimmed.startsWith('cout');

    // Classify context and pick hint
    if (isForLoop) {
      if (forLoopsBeforeLine === 0) {
        return { type: 'cursor', text: CURSOR_HINTS.outerLoop, isCode: false };
      }
      return { type: 'cursor', text: CURSOR_HINTS.innerLoop, isCode: false };
    }

    if (isCout) {
      return { type: 'cursor', text: CURSOR_HINTS.cout, isCode: false };
    }

    // nestLevel 1 = inside main only; 2 = inside outer loop; 3+ = inside inner loop
    if (nestLevel >= 3) {
      return { type: 'cursor', text: CURSOR_HINTS.insideInner, isCode: false };
    }
    if (nestLevel === 2 && forLoopsBeforeLine >= 1) {
      return { type: 'cursor', text: CURSOR_HINTS.insideOuter, isCode: false };
    }

    // Default: show the loop structure fallback for this pattern
    return this._fallbackHint(patternKey);
  }

  // -------------------------------------------------------------------------
  // explainCode — plain-English explanation of the student's code
  // Returns a string
  // -------------------------------------------------------------------------
  explainCode(code, patternKey) {
    const lines = code.split('\n');
    const explanations = [];

    // Parse for loops
    const forLoops = [];
    for (const line of lines) {
      const m = line.match(/for\s*\(\s*(?:int\s+)?(\w+)\s*=\s*([^;]+);\s*\w+\s*([<>]=?)\s*([^;]+);\s*(.+?)\)/);
      if (m) {
        forLoops.push({
          variable: m[1],
          start:    m[2].trim(),
          op:       m[3],
          bound:    m[4].trim(),
          incr:     m[5].trim()
        });
      }
    }

    if (forLoops.length === 0) {
      return 'No for loops found yet. Add a for loop to start generating the pattern.';
    }

    const outer = forLoops[0];
    const inner = forLoops[1];

    // Describe outer loop
    const outerUp = outer.op.includes('<');
    const outerDesc = outerUp
      ? `counts up from ${outer.start} to ${outer.bound}`
      : `counts down from ${outer.start} to ${outer.bound}`;
    explanations.push(`Your outer loop ${outerDesc} — one row per iteration.`);

    // Describe inner loop
    if (inner) {
      const innerBound = inner.bound;
      const outerVar   = outer.variable;
      if (innerBound.includes(outerVar)) {
        const grows = outerUp ? 'increases' : 'decreases';
        explanations.push(
          `Your inner loop runs up to ${innerBound}, so the number of items per row ${grows} as rows progress — this creates a triangle-like shape.`
        );
      } else {
        explanations.push(
          `Your inner loop always runs ${innerBound} times per row — same count every row, so rows will be equal in width.`
        );
      }
    } else {
      explanations.push('You only have one loop. Most patterns need two nested loops — one for rows, one for items per row.');
    }

    // Describe output
    const coutLines  = lines.filter(l => l.trim().startsWith('cout'));
    const hasStar    = coutLines.some(l => l.includes('"*') || l.includes("'*'"));
    const hasNewline = coutLines.some(l => l.includes('\\n') || l.includes('endl'));

    if (hasStar && hasNewline) {
      explanations.push("You're printing stars and ending each row with a newline ✓");
    } else if (hasStar && !hasNewline) {
      explanations.push('Tip: add cout << "\\n"; after the inner loop to end each row.');
    } else if (!hasStar && coutLines.length > 0) {
      explanations.push('Tip: add cout << "* "; inside the inner loop to print stars.');
    } else if (coutLines.length === 0) {
      explanations.push('No cout statements found — add output inside the loops to generate the pattern.');
    }

    return explanations.join(' ');
  }

  // -------------------------------------------------------------------------
  // getMistakeHint — specific feedback when output doesn't match
  // Returns a hint string or null if no specific diagnosis found
  // -------------------------------------------------------------------------
  getMistakeHint(yourOutput, expected, patternKey) {
    if (!yourOutput || !yourOutput.trim()) return null;

    const outLines = yourOutput.trim().split('\n').map(l => l.trimEnd());
    const expLines = expected.trim().split('\n').map(l => l.trimEnd());

    // Row count mismatch
    if (outLines.length < expLines.length) {
      return `Your output has ${outLines.length} row${outLines.length !== 1 ? 's' : ''} but needs ${expLines.length}. Check your outer loop — it may be stopping too early.`;
    }
    if (outLines.length > expLines.length) {
      return `Your output has ${outLines.length} rows but needs only ${expLines.length}. Check your outer loop condition — it may be running too many times.`;
    }

    // Upside-down check (reverse the output lines and compare)
    const flipped = [...outLines].reverse().join('\n');
    if (flipped === expLines.join('\n')) {
      const isDownward = patternKey.startsWith('d');
      return `Your triangle is upside-down — try counting your outer loop ${isDownward ? 'UP from 1 to N' : 'DOWN from N to 1'}.`;
    }

    // Leading spaces check
    const expHasLeadSpaces = expLines.some(l => l.startsWith(' '));
    const outHasLeadSpaces = outLines.some(l => l.startsWith(' '));
    if (expHasLeadSpaces && !outHasLeadSpaces) {
      return 'Your pattern is missing leading spaces. Print spaces before each row\'s stars to align the shape correctly.';
    }
    if (!expHasLeadSpaces && outHasLeadSpaces) {
      return 'Your pattern has extra leading spaces that shouldn\'t be there. Check your space-printing loop.';
    }

    // Star count analysis
    const countStars = l => (l.match(/\*/g) || []).length;
    const outCounts  = outLines.map(countStars);
    const expCounts  = expLines.map(countStars);
    const totalOut   = outCounts.reduce((a, b) => a + b, 0);
    const totalExp   = expCounts.reduce((a, b) => a + b, 0);

    if (totalExp > 0 && totalOut > totalExp * 1.4) {
      return 'You have too many stars per row — check the upper bound of your inner loop.';
    }
    if (totalExp > 0 && totalOut < totalExp * 0.6 && totalOut > 0) {
      return 'You have too few stars — your inner loop upper bound may be too small.';
    }

    // Hollow pattern: expected is hollow but output looks solid
    const isHollowPattern = /^h/.test(patternKey) || /h/.test(patternKey);
    if (isHollowPattern && expLines.length > 2) {
      const expMidHollow = expLines.slice(1, -1).some(l => /\*\s+\*/.test(l));
      const outMidSolid  = outLines.slice(1, -1).some(l => countStars(l) > 2);
      if (expMidHollow && outMidSolid) {
        return 'This is a hollow pattern — only print stars on the border edges of each row (first and last position per row).';
      }
    }

    // First mismatched row by star count
    const firstBad = outLines.findIndex((l, i) => countStars(l) !== countStars(expLines[i]));
    if (firstBad >= 0) {
      const got  = countStars(outLines[firstBad]);
      const want = countStars(expLines[firstBad]);
      return `Row ${firstBad + 1} has ${got} star${got !== 1 ? 's' : ''} but needs ${want}. Trace your loop variable for that row to see why.`;
    }

    return null;
  }

  // -------------------------------------------------------------------------
  // getForLoopHint — detects if cursor is inside a for() and returns the
  // suggested value for whichever part (init/cond/incr) the cursor is in.
  // Returns { part: 'init'|'cond'|'incr', suggestion: string } or null.
  // -------------------------------------------------------------------------
  getForLoopHint(code, cursorPos, patternKey) {
    const before = code.substring(0, cursorPos);

    // Find the last for( keyword before the cursor
    const forRegex = /\bfor\s*\(/g;
    let lastFor = null;
    let m;
    while ((m = forRegex.exec(before)) !== null) lastFor = m;
    if (!lastFor) return null;

    // Index of the opening '(' of this for statement
    const openParen = lastFor.index + lastFor[0].length - 1;

    // Find the matching closing ')' scanning forward from openParen
    let depth = 0, closeParen = -1;
    for (let i = openParen; i < code.length; i++) {
      if (code[i] === '(') depth++;
      else if (code[i] === ')') { depth--; if (depth === 0) { closeParen = i; break; } }
    }

    // Cursor must be strictly inside the parens
    if (cursorPos <= openParen || (closeParen !== -1 && cursorPos > closeParen)) return null;

    // Count semicolons from openParen+1 to cursorPos, skipping nested parens
    const segment = code.substring(openParen + 1, cursorPos);
    let semis = 0, d = 0;
    for (const ch of segment) {
      if (ch === '(') d++;
      else if (ch === ')') d--;
      else if (ch === ';' && d === 0) semis++;
    }
    if (semis > 2) return null; // not a for() we recognise

    // Determine outer vs inner loop by counting for loops before this one
    const beforeFor = code.substring(0, lastFor.index);
    const forsBefore = (beforeFor.match(/\bfor\s*\(/g) || []).length;
    const loopHints = FOR_PART_HINTS[patternKey] ?? FOR_PART_HINTS._default;
    const loop = forsBefore === 0 ? loopHints.outer : loopHints.inner;
    if (!loop) return null;

    const parts = ['init', 'cond', 'incr'];
    const part  = parts[semis];
    const suggestion = loop[part];
    if (!suggestion) return null;

    return { part, suggestion };
  }

  // -------------------------------------------------------------------------
  // Rule-based fallback hint (loop structure for the selected pattern)
  // -------------------------------------------------------------------------
  _fallbackHint(patternKey) {
    const data = PATTERN_FALLBACKS[patternKey] ?? PATTERN_FALLBACKS._default;
    return { type: 'fallback', text: data.loops, tip: data.tip, isCode: true };
  }
}

// ---------------------------------------------------------------------------
// Expose globally and initialize immediately — no loading delay needed
// ---------------------------------------------------------------------------
window.aiAssistant = new AIAssistant();
window.aiAssistant.initialize();

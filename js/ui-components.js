// UI Components and utilities
class UIComponents {
  constructor(appState, patternManager, linter) {
    this.appState = appState;
    this.patternManager = patternManager;
    this.linter = linter;
    this.elements = {};
  }

  // Initialize DOM elements
  initElements() {
    this.elements = {
      editor: document.getElementById('editor'),
      runBtn: document.getElementById('runBtn'),
      resetBtn: document.getElementById('resetBtn'),
      lintBtn: document.getElementById('lintBtn'),
      stdout: document.getElementById('stdout'),
      expectedPattern: document.getElementById('expectedPattern'),
      feedback: document.getElementById('feedback'),
      patternSelect: document.getElementById('pattern'),
      nInput: document.getElementById('n'),
      patternHint: document.getElementById('patternHint'),
      hintToggle: document.getElementById('hintToggle'),
      hintContent: document.getElementById('hintContent'),
      hintArrow: document.getElementById('hintArrow'),
      noteToggle: document.getElementById('noteToggle'),
      noteContent: document.getElementById('noteContent'),
      noteArrow: document.getElementById('noteArrow'),
      status: document.getElementById('status')
    };

    // Check for missing elements
    Object.entries(this.elements).forEach(([key, element]) => {
      if (!element) {
        console.error(`Element not found: ${key}`);
      }
    });
  }

  // Utility functions
  escapeHtml(s) {
    return s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  // Create lint warnings element
  createLintElement() {
    const lintEl = document.createElement('div');
    lintEl.id = 'lintWarnings';
    lintEl.style.cssText = 'border-top:1px solid var(--b);padding:.5rem .75rem;font-size:.85em;color:var(--muted);background:#f1f8ff;display:none';
    
    const main = document.querySelector('main');
    const feedback = this.elements.feedback.parentNode;
    main.insertBefore(lintEl, feedback);
    
    return lintEl;
  }

  // Update expected pattern display
  updateExpectedPattern() {
    const state = this.appState.getState();
    const expected = this.patternManager.generatePattern(state.selectedPattern, state.n);
    this.elements.expectedPattern.textContent = expected;
  }

  // Update hint display
  updateHint() {
    const state = this.appState.getState();
    const hint = this.patternManager.getHint(state.selectedPattern);
    this.elements.patternHint.innerHTML = hint;
  }

  // Toggle hint visibility
  toggleHint() {
    const isVisible = this.elements.hintContent.style.display !== 'none';
    this.elements.hintContent.style.display = isVisible ? 'none' : 'block';
    this.elements.hintArrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
  }

  // Toggle note to user visibility
  toggleNote() {
    const isVisible = this.elements.noteContent.style.display !== 'none';
    this.elements.noteContent.style.display = isVisible ? 'none' : 'block';
    this.elements.noteArrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
  }

  // Update linting display
  updateLintDisplay() {
    const state = this.appState.getState();
    const lintEl = document.getElementById('lintWarnings') || this.createLintElement();
    
    if (!state.lintingEnabled) {
      lintEl.style.display = 'none';
      return;
    }

    if (state.lintWarnings.length > 0) {
      lintEl.innerHTML = '<h4 class="muted" style="margin:.2rem 0 .4rem">Linting Suggestions</h4>' +
        state.lintWarnings.map(w => `• ${this.escapeHtml(w)}`).join('<br>');
      lintEl.style.display = 'block';
    } else if (state.code.trim()) {
      lintEl.innerHTML = '<h4 class="muted" style="margin:.2rem 0 .4rem">Linting Suggestions</h4>No issues found ✅';
      lintEl.style.display = 'block';
    } else {
      lintEl.style.display = 'none';
    }
  }

  // Update lint button appearance
  updateLintButton() {
    const state = this.appState.getState();
    this.elements.lintBtn.textContent = state.lintingEnabled ? 'Linting: On' : 'Linting: Off';
    this.elements.lintBtn.style.background = state.lintingEnabled ? '#90cdf4' : '#bee3f8';
  }

  // Diff lines for output comparison
  diffLines(a, b) {
    const A = a.split("\n"), B = b.split("\n"), m = Math.max(A.length, B.length);
    const outA = [], outB = [], issues = [];
    for (let i = 0; i < m; i++) {
      const la = A[i] ?? "", lb = B[i] ?? "";
      if (la === lb) { 
        outA.push(la); 
        outB.push(lb); 
        continue; 
      }
      outA.push(this.annotate(la, 'bad')); 
      outB.push(this.annotate(lb, 'good'));
      // Simple diagnostics
      if (la.replace(/ /g, "").length !== lb.replace(/ /g, "").length) {
        issues.push(`Line ${i + 1}: wrong number of stars.`);
      } else if (la.length !== lb.length) {
        issues.push(`Line ${i + 1}: spacing/indent is off.`);
      } else {
        issues.push(`Line ${i + 1}: characters differ.`);
      }
    }
    return { a: outA.join("\n"), b: outB.join("\n"), issues };
  }

  annotate(s, cls) {
    return s ? `%${cls}%${s}%/%` : "";
  }

  // Render annotated output
  renderAnnotated(el, s) {
    const parts = s.split(/(%bad%|%good%|%\/%)/);
    let mode = null, html = "";
    for (const p of parts) {
      if (p === '%bad%') { mode = 'bad'; continue; }
      if (p === '%good%') { mode = 'good'; continue; }
      if (p === '%/%') { mode = null; continue; }
      if (!p) continue;
      if (mode) html += `<div class="diffLine ${mode}">${this.escapeHtml(p)}</div>`;
      else html += `<div class="diffLine">${this.escapeHtml(p)}</div>`;
    }
    el.innerHTML = html;
  }
}
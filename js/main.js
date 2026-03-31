// Main application orchestrator

// Default C++ boilerplate code
const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {

    return 0;
}`;

class BridgeShapeDojoApp {
  constructor() {
    this.patternManager = new PatternManager();
    this.linter = new CppLinter();
    this.appState = new AppState();
    this.ui = new UIComponents(this.appState, this.patternManager, this.linter);
    this.progress = new ProgressTracker();

    this.setupStateSubscriptions();
    this.lintTimeout = null;
    this.hintTimeout = null; // for cursor-aware hint debounce
  }

  // Subscribe to state changes
  setupStateSubscriptions() {
    this.appState.subscribe((state, changes) => {
      if (changes.selectedPattern !== undefined || changes.n !== undefined) {
        this.ui.updateExpectedPattern();
        this.ui.updateHint();
      }

      if (changes.lintingEnabled !== undefined) {
        this.linter.setEnabled(state.lintingEnabled);
        this.ui.updateLintButton();
        this.ui.updateLintDisplay();
      }

      if (changes.code !== undefined && state.lintingEnabled) {
        this.debouncedLint();
      }

      if (changes.lintWarnings !== undefined) {
        this.ui.updateLintDisplay();
      }
    });
  }

  // Initialize the application
  init() {
    this.ui.initElements();
    this.setupEventListeners();
    this.initializeState();
    this.setupAIAssistant();
    this.setupProgress();
  }

  // Set up all event listeners
  setupEventListeners() {
    // Pattern selection — also clear stale AI hint and announce selection
    this.ui.elements.patternSelect.addEventListener('change', (e) => {
      this.appState.setPattern(e.target.value);
      const box = document.getElementById('aiHintBox');
      if (box) box.style.display = 'none';
      const selectedText = e.target.options[e.target.selectedIndex].text.replace(/^✓\s*/, '');
      this._announce(`Pattern selected: ${selectedText}`);
    });

    // N input
    this.ui.elements.nInput.addEventListener('input', (e) => {
      this.appState.setN(e.target.value);
    });

    // Editor changes — update state and schedule cursor hint
    this.ui.elements.editor.addEventListener('input', (e) => {
      this.appState.setCode(e.target.value);
      this.scheduleCursorHint();
    });

    // Tab key support in editor
    this.ui.elements.editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.ui.elements.editor.selectionStart;
        const end = this.ui.elements.editor.selectionEnd;
        this.ui.elements.editor.value = this.ui.elements.editor.value.substring(0, start) +
          '    ' + this.ui.elements.editor.value.substring(end);
        this.ui.elements.editor.selectionStart = this.ui.elements.editor.selectionEnd = start + 4;
        this.appState.setCode(this.ui.elements.editor.value);
      }
    });

    // Hide loop-bound hint when editor loses focus
    this.ui.elements.editor.addEventListener('blur', () => {
      const hintEl = document.getElementById('loopBoundHint');
      if (hintEl) hintEl.style.display = 'none';
    });

    // Also update cursor hint when cursor moves (click/select)
    this.ui.elements.editor.addEventListener('click', () => this.scheduleCursorHint());
    this.ui.elements.editor.addEventListener('keyup', (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
        this.scheduleCursorHint();
      }
    });

    // Run button
    this.ui.elements.runBtn.addEventListener('click', () => {
      this.runCode();
    });

    // Reset button
    this.ui.elements.resetBtn.addEventListener('click', () => {
      this.resetCode();
    });

    // Lint button
    this.ui.elements.lintBtn.addEventListener('click', () => {
      const currentState = this.appState.getState();
      this.appState.setLinting(!currentState.lintingEnabled);
    });

    // Hint toggle — also refresh AI hint when panel opens, manage focus
    this.ui.elements.hintToggle.addEventListener('click', () => {
      this.ui.toggleHint();
      if (this.ui.elements.hintContent.style.display !== 'none') {
        this.fetchAIHint();
        // Move focus into the panel so screen reader users hear the content
        this.ui.elements.hintContent.setAttribute('tabindex', '-1');
        this.ui.elements.hintContent.focus();
      }
    });
    // Space/Enter keyboard activation for hint toggle (role="button" div)
    this.ui.elements.hintToggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.ui.elements.hintToggle.click();
      }
    });

    // Note to User toggle
    this.ui.elements.noteToggle.addEventListener('click', () => {
      this.ui.toggleNote();
    });
    // Space/Enter keyboard activation for note toggle (role="button" div)
    this.ui.elements.noteToggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.ui.elements.noteToggle.click();
      }
    });

    // Explain My Code button
    const explainBtn = document.getElementById('explainBtn');
    if (explainBtn) {
      explainBtn.addEventListener('click', () => this.showCodeExplanation());
    }

    // Keyboard shortcuts — fire when editor is focused or no input element is focused
    document.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      const editorFocused = active === this.ui.elements.editor;
      const noInputFocused = !active || !['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName);
      if (!editorFocused && !noInputFocused) return;

      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === 'Enter') {
        e.preventDefault();
        this._flashRunBtn();
        this.runCode();
        return;
      }

      if (mod && e.key === 'r') {
        e.preventDefault();
        this.resetCode();
        return;
      }

      if (mod && e.key === '/') {
        e.preventDefault();
        this.ui.elements.hintToggle.click();
        return;
      }

      if (e.key === 'Escape') {
        const hintContent = this.ui.elements.hintContent;
        if (hintContent && hintContent.style.display !== 'none') {
          e.preventDefault();
          // Close hint panel and return focus to toggle
          hintContent.style.display = 'none';
          const arrow = this.ui.elements.hintArrow;
          if (arrow) arrow.style.transform = 'rotate(0deg)';
          this.ui.elements.hintToggle.setAttribute('aria-expanded', 'false');
          this.ui.elements.hintToggle.focus();
        }
      }
    });
  }

  // Initialize application state
  initializeState() {
    // Set initial state values
    this.appState.setState({
      code: DEFAULT_CODE,
      selectedPattern: 'left',
      n: 5,
      lintingEnabled: false
    });

    // Update UI elements
    this.ui.elements.editor.value = DEFAULT_CODE;
    this.ui.elements.patternSelect.value = 'left';
    this.ui.elements.nInput.value = '5';

    // Force initial updates
    this.ui.updateExpectedPattern();
    this.ui.updateHint();
    this.ui.updateLintButton();
  }

  // Debounced linting
  debouncedLint() {
    clearTimeout(this.lintTimeout);
    this.lintTimeout = setTimeout(() => {
      const state = this.appState.getState();
      const warnings = this.linter.lint(state.code);
      this.appState.setLintWarnings(warnings);
    }, 500);
  }

  // Schedule a cursor-aware hint update (debounced 500ms)
  scheduleCursorHint() {
    clearTimeout(this.hintTimeout);
    this.hintTimeout = setTimeout(() => this.updateCursorHint(), 500);
  }

  // Update the AI hint box with a context-aware hint based on cursor position
  updateCursorHint() {
    const hintContent = this.ui.elements.hintContent;
    if (!hintContent || hintContent.style.display === 'none') return;

    const box  = document.getElementById('aiHintBox');
    const text = document.getElementById('aiHintText');
    if (!box || !text) return;

    const ai = window.aiAssistant;
    if (!ai) return;

    const state     = this.appState.getState();
    const cursorPos = this.ui.elements.editor.selectionStart || 0;
    const result    = ai.getCursorHint(state.code, cursorPos, state.selectedPattern);

    const label = box.querySelector('.ai-hint-label');
    if (result.isCode) {
      let html = `<pre class="ai-code-block">${this.ui.escapeHtml(result.text)}</pre>`;
      if (result.tip) {
        html += `<p class="tiny" style="margin:.3rem 0 0;color:var(--muted)">${this.ui.escapeHtml(result.tip)}</p>`;
      }
      text.innerHTML = html;
      if (label) label.textContent = '✦ Loop Structure';
    } else {
      text.innerHTML = `<span class="tiny">${this.ui.escapeHtml(result.text)}</span>`;
      if (label) label.textContent = '✦ Context Hint';
    }

    box.style.display = 'block';

    // Also update the inline loop-bound ghost hint
    this.updateLoopBoundHint(state.code, cursorPos, state.selectedPattern);
  }

  // Show a subtle ghost hint when cursor is inside a for() expression
  updateLoopBoundHint(code, cursorPos, patternKey) {
    const hintEl = document.getElementById('loopBoundHint');
    if (!hintEl) return;

    const ai = window.aiAssistant;
    if (!ai || !ai.getForLoopHint) { hintEl.style.display = 'none'; return; }

    const hint = ai.getForLoopHint(code, cursorPos, patternKey);
    if (!hint) { hintEl.style.display = 'none'; return; }

    const partLabel = { init: 'initializer', cond: 'condition', incr: 'increment' }[hint.part] || hint.part;
    hintEl.textContent = `for() ${partLabel} → ${hint.suggestion}`;
    hintEl.style.display = 'block';
  }

  // Show a plain-English explanation of the student's code
  showCodeExplanation() {
    const ai = window.aiAssistant;
    if (!ai) return;

    const state       = this.appState.getState();
    const explanation = ai.explainCode(state.code, state.selectedPattern);

    this.ui.elements.feedback.innerHTML =
      `<div style="background:var(--code-bg);border:1px solid var(--b);border-radius:4px;padding:.5rem .75rem;font-size:.9em">` +
      `<b style="color:var(--acc)">✦ Code Explanation</b><br>` +
      `<span>${this.ui.escapeHtml(explanation)}</span></div>`;
  }

  // Reset code to default
  resetCode() {
    this.appState.setCode(DEFAULT_CODE);
    this.ui.elements.editor.value = DEFAULT_CODE;
    this.ui.elements.editor.focus();
  }

  // Run the C++ code
  async runCode() {
    this.ui.elements.runBtn.disabled = true;
    this.ui.elements.status.textContent = 'Running...';

    const state = this.appState.getState();
    const src = state.code;
    const N = state.n;

    // Record the attempt regardless of outcome
    this.progress.recordAttempt(state.selectedPattern);

    try {
      const result = this.executeCode(src, N);
      const output = result.output ?? "";

      this.appState.setOutput(output);

      // Display output
      const challengeMode = document.body.classList.contains('challenge-mode');
      if (output) {
        this.ui.elements.stdout.textContent = output;

        // Compare with expected
        const expected = this.patternManager.generatePattern(state.selectedPattern, N);
        const isMatch = output.trim() === expected.trim();
        const msgs    = result.errors || [];

        if (!challengeMode) {
          // Normal mode: show diff coloring
          const {a} = this.ui.diffLines(output, expected);
          this.ui.renderAnnotated(this.ui.elements.stdout, a);
        }

        // Provide feedback
        if (msgs.length) {
          this.ui.elements.feedback.innerHTML =
            msgs.map(m => `• ${this.ui.escapeHtml(m)}`).join('<br>');
          this._announce(msgs.join('. '));
        } else if (isMatch) {
          const firstTime = this.progress.recordCompletion(state.selectedPattern);
          this.updatePatternBadges();
          const celebration = firstTime ? ' First time! 🎉' : '';
          this.ui.elements.feedback.innerHTML =
            `<span class="ok">Perfect! ✅ Your pattern matches exactly!${celebration}</span>`;
          this._announce(`Correct! Pattern complete.${firstTime ? ' First time!' : ''}`);
        } else if (challengeMode) {
          // Challenge mode: directional hint only — no line-by-line specifics
          const ai   = window.aiAssistant;
          const hint = ai ? ai.getMistakeHint(output, expected, state.selectedPattern, src) : null;
          if (hint) {
            this.ui.elements.feedback.innerHTML =
              `<span class="err">✦ ${this.ui.escapeHtml(hint)}</span>`;
            this._announce(`Not quite. ${hint}`);
          } else {
            this.ui.elements.feedback.innerHTML =
              `<span class="err">Not quite — keep trying! 🎯</span>`;
            this._announce('Not quite. Keep trying!');
          }
        } else {
          // Normal mode: full hint
          const ai   = window.aiAssistant;
          const hint = ai ? ai.getMistakeHint(output, expected, state.selectedPattern, src) : null;
          if (hint) {
            this.ui.elements.feedback.innerHTML =
              `<span class="err">✦ ${this.ui.escapeHtml(hint)}</span>`;
            this._announce(`Not quite. ${hint}`);
          } else {
            this.ui.elements.feedback.innerHTML =
              `<span class="err">Not quite — compare your output with the expected pattern. Try using "* " (asterisk + space) per star.</span>`;
            this._announce('Not quite. Compare your output with the expected pattern.');
          }
        }
      } else {
        this.ui.elements.stdout.textContent = 'No output generated. Check your code structure.';
        this.ui.elements.feedback.innerHTML = result.errors
          ? result.errors.map(m => `• ${this.ui.escapeHtml(m)}`).join('<br>')
          : '';
      }

    } catch (error) {
      this.ui.elements.stdout.textContent = `Error: ${error.message}`;
      this.ui.elements.feedback.innerHTML = `<span class="err">• ${this.ui.escapeHtml(error.message)}</span>`;
    }

    this.ui.elements.status.textContent = 'Done.';
    this.ui.elements.runBtn.disabled = false;

    // Move focus to feedback so screen reader users hear the result
    this.ui.elements.feedback.focus();
  }

  // Set up progress tracking UI and event listeners
  setupProgress() {
    // Wire reset button
    const resetBtn = document.getElementById('resetProgressBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all progress? This cannot be undone.')) {
          this.progress.reset();
          this.updateProgressUI();
          this.updatePatternBadges();
        }
      });
    }

    // React to progress changes
    this.progress.onChange(() => {
      this.updateProgressUI();
      this.updatePatternBadges();
    });

    // Initial render
    this.updateProgressUI();
    this.updatePatternBadges();
  }

  // Update the progress bar and text
  updateProgressUI() {
    const { done, total } = this.progress.getProgress();
    const textEl = document.getElementById('progressText');
    const fillEl = document.getElementById('progressFill');
    const barEl  = document.getElementById('progressBar');
    if (textEl) textEl.textContent = `${done} / ${total} solved`;
    if (fillEl) fillEl.style.width = `${Math.round((done / total) * 100)}%`;
    if (barEl)  barEl.setAttribute('aria-valuenow', String(done));
  }

  // Add/remove checkmark badges on pattern <option> elements
  updatePatternBadges() {
    const select = this.ui.elements.patternSelect;
    if (!select) return;
    Array.from(select.options).forEach(opt => {
      const key = opt.value;
      const done = this.progress.isCompleted(key);
      // Strip any existing badge, then prepend
      opt.text = opt.text.replace(/^✓\s*/, '');
      if (done) opt.text = '✓ ' + opt.text;
    });
  }

  // Wire up the AI assistant status badge
  setupAIAssistant() {
    const badge = document.getElementById('aiStatus');
    if (!badge || !window.aiAssistant) return;

    window.aiAssistant.onStatus((status, msg) => {
      badge.style.display = '';
      badge.textContent = msg;
      badge.className = `ai-badge ai-badge--${status}`;
    });
  }

  // Fetch and render the loop-structure hint in the hint panel
  async fetchAIHint() {
    const box  = document.getElementById('aiHintBox');
    const text = document.getElementById('aiHintText');
    if (!box || !text) return;

    const ai = window.aiAssistant;
    if (!ai) { box.style.display = 'none'; return; }

    box.style.display = 'block';
    const label = box.querySelector('.ai-hint-label');
    if (label) label.textContent = '✦ Loop Structure';

    const state  = this.appState.getState();
    const result = ai.getHint(state.code, state.selectedPattern);

    let html = '';
    if (result.isCode && result.text) {
      html += `<pre class="ai-code-block">${this.ui.escapeHtml(result.text)}</pre>`;
    } else if (result.text) {
      html += `<span class="tiny">${this.ui.escapeHtml(result.text)}</span>`;
    }
    if (result.tip) {
      html += `<p class="tiny" style="margin:.3rem 0 0;color:var(--muted)">${this.ui.escapeHtml(result.tip)}</p>`;
    }

    if (html) {
      text.innerHTML = html;
    } else {
      box.style.display = 'none';
    }
  }

  // Announce a message via the hidden live region for screen readers
  _announce(text) {
    const el = document.getElementById('ariaAnnouncer');
    if (!el) return;
    el.textContent = '';
    setTimeout(() => { el.textContent = text; }, 50);
  }

  // Brief visual flash on Run button when triggered by keyboard shortcut
  _flashRunBtn() {
    const btn = this.ui.elements.runBtn;
    if (!btn) return;
    btn.classList.remove('btn--flash');
    // Force reflow so re-adding the class restarts the animation
    void btn.offsetWidth;
    btn.classList.add('btn--flash');
    btn.addEventListener('animationend', () => btn.classList.remove('btn--flash'), { once: true });
  }

  // Execute C++ code (wrapper for existing interpreter)
  executeCode(src, N) {
    try {
      const result = executeCppCode(src, N);

      if (result.success && result.output !== null) {
        return { output: result.output, nUsed: N, errors: [] };
      } else {
        const errors = [];
        if (!result.success && result.error) {
          errors.push(result.error);
        }
        return { output: null, nUsed: N, errors };
      }
    } catch (e) {
      return { output: null, nUsed: N, errors: ['Error analyzing code: ' + e.message] };
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const app = new BridgeShapeDojoApp();
  app.init();
});

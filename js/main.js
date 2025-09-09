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
    
    this.setupStateSubscriptions();
    this.lintTimeout = null;
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
  }

  // Set up all event listeners
  setupEventListeners() {
    // Pattern selection
    this.ui.elements.patternSelect.addEventListener('change', (e) => {
      this.appState.setPattern(e.target.value);
    });

    // N input
    this.ui.elements.nInput.addEventListener('input', (e) => {
      this.appState.setN(e.target.value);
    });

    // Editor changes
    this.ui.elements.editor.addEventListener('input', (e) => {
      this.appState.setCode(e.target.value);
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

    // Hint toggle
    this.ui.elements.hintToggle.addEventListener('click', () => {
      this.ui.toggleHint();
    });

    // Note to User toggle
    this.ui.elements.noteToggle.addEventListener('click', () => {
      this.ui.toggleNote();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        this.runCode();
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
    
    try {
      // Use the existing C++ interpreter
      const result = this.executeCode(src, N);
      const output = result.output ?? "";
      
      this.appState.setOutput(output);
      
      // Display output
      if (output) {
        this.ui.elements.stdout.textContent = output;
        
        // Compare with expected for visual feedback
        const expected = this.patternManager.generatePattern(state.selectedPattern, N);
        const {a} = this.ui.diffLines(output, expected);
        this.ui.renderAnnotated(this.ui.elements.stdout, a);
        
        // Provide feedback
        const yourTrimmed = output.trim();
        const expectedTrimmed = expected.trim();
        const isMatch = yourTrimmed === expectedTrimmed;
        
        const msgs = result.errors || [];
        this.ui.elements.feedback.innerHTML = msgs.length ? 
          msgs.map(m => `• ${this.ui.escapeHtml(m)}`).join("<br>") :
          (isMatch ? 
            `<span class="ok">Perfect! ✅ Your pattern matches exactly!</span>` :
            `<span class="err">Pattern shape looks good, but try using "* " (asterisk + space) to match the expected output exactly.</span>`
          );
      } else {
        this.ui.elements.stdout.textContent = "No output generated. Check your code structure.";
        this.ui.elements.feedback.innerHTML = result.errors ? 
          result.errors.map(m => `• ${this.ui.escapeHtml(m)}`).join("<br>") : "";
      }
      
    } catch (error) {
      this.ui.elements.stdout.textContent = `Error: ${error.message}`;
      this.ui.elements.feedback.innerHTML = `<span class="err">• ${this.ui.escapeHtml(error.message)}</span>`;
    }
    
    this.ui.elements.status.textContent = 'Done.';
    this.ui.elements.runBtn.disabled = false;
  }

  // Execute C++ code (wrapper for existing interpreter)
  executeCode(src, N) {
    try {
      // Use the existing C++ interpreter from cpp-interpreter.js (global scope)
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
      return { output: null, nUsed: N, errors: ["Error analyzing code: " + e.message] };
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const app = new BridgeShapeDojoApp();
  app.init();
});
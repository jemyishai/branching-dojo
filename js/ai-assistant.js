// AI Assistant for Bridge Shape Dojo — Phase 1: Foundation
// Loads Transformers.js via CDN, tries CodeT5-small, falls back to rule-based hints

const AI_CDN = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';
const AI_MODEL = 'Xenova/codet5-small';
const AI_TASK  = 'text2text-generation';
const LOAD_DELAY_MS = 2000; // wait for page to feel ready before downloading model

// ---------------------------------------------------------------------------
// Educational code-structure hints — shown when model is unavailable/loading
// More code-focused than the pattern text hints in patterns.js
// ---------------------------------------------------------------------------
const PATTERN_FALLBACKS = {
  left:   { loops: 'for (int i = 1; i <= N; i++)\n    for (int j = 1; j <= i; j++)',
             tip: 'Row i gets exactly i stars.' },
  hleft:  { loops: 'for (int i = 1; i <= N; i++)\n    for (int j = 1; j <= i; j++)',
             tip: 'Star only if j==1, j==i, or i==N (borders).' },
  dleft:  { loops: 'for (int i = N; i >= 1; i--)\n    for (int j = 1; j <= i; j++)',
             tip: 'Count outer loop DOWN from N to 1.' },
  dhleft: { loops: 'for (int i = N; i >= 1; i--)\n    for (int j = 1; j <= i; j++)',
             tip: 'Star only on borders: j==1, j==i, or i==N.' },
  right:  { loops: 'for (int i = 1; i <= N; i++) {\n    // (N-i) spaces, then i stars\n}',
             tip: 'Print N-i spaces first, then i stars per row.' },
  hright: { loops: 'for (int i = 1; i <= N; i++) {\n    // spaces + border stars only\n}',
             tip: 'Hollow: star if j==1 or j==i. Last row (i==N) is solid.' },
  dright: { loops: 'for (int i = N; i >= 1; i--) {\n    // (N-i) spaces, then i stars\n}',
             tip: 'Same as right triangle, outer loop counts down.' },
  dhright:{ loops: 'for (int i = N; i >= 1; i--)',
             tip: 'Hollow downward right: borders only.' },
  pyr:    { loops: 'for (int i = 1; i <= N; i++) {\n    // (N-i) spaces\n    // (2*i-1) stars\n}',
             tip: 'Center each row: N-i leading spaces, then 2i-1 stars.' },
  hpyr:   { loops: 'for (int i = 1; i <= N; i++) {\n    // spaces, then first+last star only\n}',
             tip: 'Print first and last of 2i-1 stars; fill rest with spaces.' },
  dpyr:   { loops: 'for (int i = N; i >= 1; i--) {\n    // (N-i) spaces\n    // (2*i-1) stars\n}',
             tip: 'Downward pyramid: same formula, outer loop counts down.' },
  hdpyr:  { loops: 'for (int i = N; i >= 1; i--)',
             tip: 'Hollow downward pyramid: borders only per row.' },
  sq:     { loops: 'for (int i = 1; i <= N; i++)\n    for (int j = 1; j <= N; j++)',
             tip: 'Always N stars per row — no conditions needed.' },
  hsq:    { loops: 'for (int i = 1; i <= N; i++)\n    for (int j = 1; j <= N; j++)',
             tip: 'Star if i==1, i==N, j==1, or j==N.' },
  xsq:    { loops: 'for (int i = 1; i <= N; i++)\n    for (int j = 1; j <= N; j++)',
             tip: 'Star if on border OR diagonal (i==j or i+j==N+1).' },
  dia:    { loops: '// Upper half: i = 1..N\n// Lower half: i = N-1..1',
             tip: 'Diamond = upward pyramid + downward pyramid. Two loop blocks.' },
  hdia:   { loops: '// Two halves: hollow pyramid + hollow downward pyramid',
             tip: 'Hollow diamond: combine hollow upward and downward halves.' },
  _default:{ loops: 'for (int i = 1; i <= N; i++)\n    for (int j = ...; j <= ...; j++)',
              tip: 'Outer loop = rows, inner loop = elements per row.' }
};

// ---------------------------------------------------------------------------
// AIAssistant class
// ---------------------------------------------------------------------------
class AIAssistant {
  constructor() {
    this.status = 'idle';      // idle | loading | ready | unavailable
    this._msg    = '';
    this._pipe   = null;
    this._cbs    = [];
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

  // -------------------------------------------------------------------------
  // Async model initialization — called after a short delay
  // -------------------------------------------------------------------------
  async initialize() {
    this._emit('loading', 'AI loading…');
    try {
      const { pipeline, env } = await import(AI_CDN);

      // Use remote models from Hugging Face Hub; cache in browser IndexedDB
      env.allowLocalModels  = false;
      env.useBrowserCache   = true;

      this._pipe = await pipeline(AI_TASK, AI_MODEL, {
        progress_callback: (data) => {
          if (data.status === 'progress' && data.file && data.total) {
            const pct = Math.round((data.loaded / data.total) * 100);
            this._emit('loading', `AI ${pct}%`);
          }
        }
      });
      this._emit('ready', 'AI Ready');

    } catch (err) {
      console.warn('[AI] Model load failed — using educational fallbacks.', err?.message ?? err);
      this._emit('unavailable', 'AI Unavailable');
    }
  }

  // -------------------------------------------------------------------------
  // Public: get a hint for the current editor state
  // Returns { type, text, tip, isCode }
  // -------------------------------------------------------------------------
  async getHint(code, patternKey) {
    if (this.status === 'ready' && this._pipe) {
      try {
        return await this._modelHint(code, patternKey);
      } catch (e) {
        console.warn('[AI] Inference failed, using fallback:', e?.message);
      }
    }
    return this._fallbackHint(patternKey);
  }

  // -------------------------------------------------------------------------
  // Model-based hint via CodeT5-small
  // -------------------------------------------------------------------------
  async _modelHint(code, patternKey) {
    // Build a focused prompt from meaningful code lines (skip boilerplate)
    const codeLines = code.split('\n')
      .filter(l => {
        const t = l.trim();
        return t && !t.startsWith('#') && !t.startsWith('//') && !t.startsWith('using');
      })
      .slice(-8)
      .join('\n');

    const prompt = `// C++ ${patternKey} star pattern\n${codeLines}`;
    const result = await this._pipe(prompt, {
      max_new_tokens: 40,
      temperature: 0.2,
      do_sample: false
    });

    const generated = (result[0]?.generated_text ?? '').replace(prompt, '').trim();
    if (generated.length > 5) {
      return { type: 'ai', text: generated, tip: '', isCode: true };
    }
    // Model output wasn't useful — fall through
    return this._fallbackHint(patternKey);
  }

  // -------------------------------------------------------------------------
  // Rule-based fallback hint
  // -------------------------------------------------------------------------
  _fallbackHint(patternKey) {
    const data = PATTERN_FALLBACKS[patternKey] ?? PATTERN_FALLBACKS._default;
    return { type: 'fallback', text: data.loops, tip: data.tip, isCode: true };
  }
}

// ---------------------------------------------------------------------------
// Expose globally and kick off loading after the UI is stable
// ---------------------------------------------------------------------------
window.aiAssistant = new AIAssistant();

setTimeout(() => {
  window.aiAssistant.initialize();
}, LOAD_DELAY_MS);

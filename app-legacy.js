// --- Utilities: string builders for expected outputs (mirror site's 17 patterns) ---
const SP="  ", STAR="* ";
const rep=(s,k)=>Array.from({length:k},()=>s).join("");

// Pattern-specific hints
const patternHints = {
  left: "Start with nested loops: outer loop for rows (1 to N), inner loop for stars (1 to current row).",
  hleft: "Like left triangle, but only print stars on borders: first/last star of each row, and fill the last row.",
  dleft: "Downward left triangle: outer loop for rows, but decrease stars each row (N down to 1).",
  dhleft: "Downward hollow left triangle: like dleft, but only borders have stars.",
  right: "Right triangle needs leading spaces! Print (N - current row) spaces, then stars.",
  hright: "Right triangle with hollow center: spaces + border stars only (except last row which is solid).",
  dright: "Downward right triangle: increase leading spaces as you go down, decrease stars.",
  dhright: "Downward hollow right triangle: like dright, but only border stars.",
  pyr: "Pyramid: center-aligned triangle. Print spaces (N - row), then (2 * row - 1) stars.",
  hpyr: "Hollow pyramid: like pyramid, but only border stars (first and last of each row).",
  dpyr: "Downward pyramid: start wide at top, get narrower. Print spaces (row), then stars.",
  hdpyr: "Downward hollow pyramid: like dpyr, but only border stars.",
  sq: "Square: same number of stars in every row (N stars per row, N rows).",
  hsq: "Hollow square: fill only the borders (top/bottom rows full, middle rows just edges).",
  xsq: "Crossed square: like hollow square, but also fill the diagonals (when i == j or i + j == N + 1).",
  dia: "Diamond: combine upward pyramid (1 to N) with downward pyramid (N-1 down to 1).",
  hdia: "Hollow diamond: like diamond, but only border stars in each triangle part."
};

const patterns = {
  left: (n)=>range(1,n).map(i=>rep(STAR,i)).join("\n"),
  hleft: (n)=>range(1,n).map(i=>{
    if(i===1) return STAR;
    if(i===n) return rep(STAR,n);
    return STAR + rep("  ", i-2) + STAR;
  }).join("\n"),
  dleft: (n)=>range(1,n).map(i=>rep(STAR,n-(i-1))).join("\n"),
  dhleft: (n)=>range(1,n).map(i=>{
    const stars=n-(i-1);
    if(i===1) return rep(STAR,stars);
    if(stars===1) return STAR;
    return STAR + rep("  ", stars-2) + STAR;
  }).join("\n"),
  right: (n)=>range(1,n).map(i=>rep(SP,n-i)+rep(STAR,i)).join("\n"),
  hright: (n)=>range(1,n).map(i=>{
    if(i===1) return rep(SP,n-1)+STAR;
    if(i===n) return rep(STAR,n);
    return rep(SP,n-i)+STAR+rep("  ", i-2)+STAR;
  }).join("\n"),
  dright: (n)=>range(0,n-1).map(k=>rep(SP,k)+rep(STAR,n-k)).join("\n"),
  dhright: (n)=>range(0,n-1).map(k=>{
    const stars=n-k;
    if(k===0) return rep(STAR,n);
    if(stars===1) return rep(SP,k)+STAR;
    return rep(SP,k)+STAR+rep("  ", stars-2)+STAR;
  }).join("\n"),
  pyr: (n)=>range(1,n).map(i=>rep(SP,n-i)+rep(STAR,2*i-1)).join("\n"),
  hpyr: (n)=>range(1,n).map(i=>{
    if(i===1) return rep(SP,n-1)+STAR;
    if(i===n) return rep(STAR,2*n-1);
    return rep(SP,n-i)+STAR+rep("  ",2*i-3)+STAR;
  }).join("\n"),
  dpyr: (n)=>range(0,n-1).map(k=>rep(SP,k)+rep(STAR,2*(n-k)-1)).join("\n"),
  hdpyr: (n)=>range(0,n-1).map(k=>{
    const width=2*(n-k)-1;
    if(k===0) return rep(STAR,2*n-1);
    if(width===1) return rep(SP,k)+STAR;
    return rep(SP,k)+STAR+rep("  ",width-2)+STAR;
  }).join("\n"),
  sq: (n)=>range(1,n).map(()=>rep(STAR,n)).join("\n"),
  hsq: (n)=>range(1,n).map(i=>{
    if(i===1||i===n) return rep(STAR,n);
    return STAR+rep("  ",n-2)+STAR;
  }).join("\n"),
  xsq: (n)=>range(1,n).map(i=>{
    return range(1,n).map(j=>{
      const border = (i===1||i===n||j===1||j===n);
      const diag = (i===j || i+j===n+1);
      return (border || diag) ? STAR : "  ";
    }).join("");
  }).join("\n"),
  dia: (n)=>{
    const up=range(1,n).map(i=>rep(SP,n-i)+rep(STAR,2*i-1)).join("\n");
    const down=range(1,n-1).map(i=>rep(SP,i)+rep(STAR,2*(n-i)-1)).join("\n");
    return up+(n>1?("\n"+down):"");
  },
  hdia: (n)=>{
    const up=range(1,n).map(i=>{
      if(i===1) return rep(SP,n-1)+STAR;
      return rep(SP,n-i)+STAR+rep("  ",2*i-3)+STAR;
    }).join("\n");
    const down=range(1,n-1).map(i=>{
      const w=2*(n-i)-1;
      if(w===1) return rep(SP,i)+STAR;
      return rep(SP,i)+STAR+rep("  ",w-2)+STAR;
    }).join("\n");
    return up+(n>1?("\n"+down):"");
  }
};

function range(a,b){ // inclusive: 1..n or 0..n-1
  return Array.from({length:(b-a+1)},(_,k)=>a+k);
}

// --- Simple C++ Linting
function lintCppCode(code) {
  const warnings = [];
  const lines = code.split('\n');
  
  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const trimmed = line.trim();
    
    // Check for missing semicolons (basic check)
    if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#') && 
        !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') &&
        !trimmed.includes('for') && !trimmed.includes('if') && !trimmed.includes('else') &&
        !trimmed.includes('while') && trimmed !== '') {
      warnings.push(`Line ${lineNum}: Statement might be missing semicolon`);
    }
    
    // Check for inconsistent spacing around operators
    if (trimmed.includes('=') && !trimmed.includes('==') && !trimmed.includes('!=') && 
        !trimmed.includes('<=') && !trimmed.includes('>=')) {
      if (!/\s=\s/.test(trimmed)) {
        warnings.push(`Line ${lineNum}: Consider adding spaces around '=' operator`);
      }
    }
    
    // Check for loop variable naming conventions
    if (trimmed.includes('for') && !/for\s*\(\s*int\s+[ijk]\s*[=<>]/.test(trimmed)) {
      if (/for\s*\(\s*int\s+\w+/.test(trimmed)) {
        warnings.push(`Line ${lineNum}: Consider using 'i', 'j', or 'k' for loop variables`);
      }
    }
    
    // Check for missing braces in loops
    if ((trimmed.includes('for') || trimmed.includes('while')) && !trimmed.includes('{')) {
      warnings.push(`Line ${lineNum}: Consider using braces {} for loop body`);
    }
    
    // Check for using cout without std:: or using namespace
    if (trimmed.includes('cout') && !code.includes('using namespace std') && !trimmed.includes('std::cout')) {
      warnings.push(`Line ${lineNum}: Use 'std::cout' or add 'using namespace std;'`);
    }
  });
  
  return warnings;
}

// --- Enhanced C++ interpreter using proper parsing
function pseudorunSubset(src, N){
  try {
    
    // Use the full C++ interpreter
    const result = executeCppCode(src, N);
    
    if (result.success && result.output !== null) {
      return {output: result.output, nUsed: N, errors: []};
    } else {
      // Fallback: provide helpful errors
      const errors = [];
      
      if (!result.success && result.error) {
        errors.push(result.error);
      }
      
      // Basic checks are now handled by the interpreter itself
      
      return {output: null, nUsed: N, errors};
    }
    
  } catch (e) {
    return {output: null, nUsed: N, errors: ["Error analyzing code: " + e.message]};
  }
}

// --- Feedback diff
function diffLines(a,b){
  const A=a.split("\n"), B=b.split("\n"), m=Math.max(A.length,B.length);
  const outA=[], outB=[], issues=[];
  for(let i=0;i<m;i++){
    const la=A[i]??"", lb=B[i]??"";
    if(la===lb){ outA.push(la); outB.push(lb); continue; }
    outA.push(annotate(la,'bad')); outB.push(annotate(lb,'good'));
    // simple diagnostics
    if(la.replace(/ /g,"").length !== lb.replace(/ /g,"").length){
      issues.push(`Line ${i+1}: wrong number of stars.`);
    } else if(la.length !== lb.length){
      issues.push(`Line ${i+1}: spacing/indent is off.`);
    } else {
      issues.push(`Line ${i+1}: characters differ.`);
    }
  }
  return {a:outA.join("\n"), b:outB.join("\n"), issues};
}

const annotate=(s,cls)=>s?`%${cls}%${s}%/%`:"";

function renderAnnotated(el, s){
  // convert %bad%...%/% markers to spans
  const parts = s.split(/(%bad%|%good%|%\/%)/);
  let mode=null, html="";
  for(const p of parts){
    if(p==='%bad%'){ mode='bad'; continue; }
    if(p==='%good%'){ mode='good'; continue; }
    if(p==='%/%'){ mode=null; continue; }
    if(!p) continue;
    if(mode) html += `<div class="diffLine ${mode}">${escapeHtml(p)}</div>`;
    else html += `<div class="diffLine">${escapeHtml(p)}</div>`;
  }
  el.innerHTML = html;
}

const escapeHtml = s => s.replace(/[&<>]/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c]));

// --- Editor setup
const defaultCode = `#include <iostream>
using namespace std;

int main() {
   
    return 0;
}`;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const editor = document.getElementById('editor');
  if (!editor) {
    console.error('Editor element not found!');
    return;
  } 
  
  editor.value = defaultCode;
  
  // Tab key support
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
    }
  });

  // --- Run flow setup
  const status = document.getElementById('status');
  const runBtn = document.getElementById('runBtn');
  const resetBtn = document.getElementById('resetBtn');
  const lintBtn = document.getElementById('lintBtn');
  const outEl = document.getElementById('stdout');
  const expectedPatternEl = document.getElementById('expectedPattern');
  const fb = document.getElementById('feedback');
  const sel = document.getElementById('pattern');
  const nInput = document.getElementById('n');
  const hintEl = document.getElementById('patternHint');
  
  // Linting state
  let lintingEnabled = false;
  
  // Update expected pattern and hint when selection changes
  function updateExpectedPattern() {
    const key = sel.value;
    const N = parseInt(nInput.value, 10) || 5;
    const expected = (patterns[key] ?? patterns.left)(N);
    expectedPatternEl.textContent = expected;
    
    // Update hint
    const hint = patternHints[key] ?? patternHints.left;
    hintEl.innerHTML = hint;
  }
  
  // Initialize expected pattern
  updateExpectedPattern();
  
  // Update when pattern or N changes
  sel.addEventListener('change', updateExpectedPattern);
  nInput.addEventListener('input', updateExpectedPattern);

  runBtn.addEventListener('click', () => {
    run();
  });
  
  resetBtn.addEventListener('click', () => {
    editor.value = defaultCode;
    editor.focus();
  });
  
  // Linting toggle
  lintBtn.addEventListener('click', () => {
    lintingEnabled = !lintingEnabled;
    lintBtn.textContent = lintingEnabled ? 'Linting: On' : 'Linting: Off';
    lintBtn.style.background = lintingEnabled ? '#90cdf4' : '#bee3f8';
    
    if (lintingEnabled) {
      showLintWarnings();
    } else {
      hideLintWarnings();
    }
  });
  
  // Show lint warnings
  function showLintWarnings() {
    if (!lintingEnabled) return;
    
    const warnings = lintCppCode(editor.value);
    const lintEl = document.getElementById('lintWarnings') || createLintElement();
    
    if (warnings.length > 0) {
      lintEl.innerHTML = '<h4 class="muted" style="margin:.2rem 0 .4rem">Linting Suggestions</h4>' +
        warnings.map(w => `• ${escapeHtml(w)}`).join('<br>');
      lintEl.style.display = 'block';
    } else {
      lintEl.innerHTML = '<h4 class="muted" style="margin:.2rem 0 .4rem">Linting Suggestions</h4>No issues found ✅';
      lintEl.style.display = 'block';
    }
  }
  
  function hideLintWarnings() {
    const lintEl = document.getElementById('lintWarnings');
    if (lintEl) {
      lintEl.style.display = 'none';
    }
  }
  
  function createLintElement() {
    const lintEl = document.createElement('div');
    lintEl.id = 'lintWarnings';
    lintEl.style.cssText = 'border-top:1px solid var(--b);padding:.5rem .75rem;font-size:.85em;color:var(--muted);background:#f1f8ff;display:none';
    
    const main = document.querySelector('main');
    const feedback = document.getElementById('feedback').parentNode;
    main.insertBefore(lintEl, feedback);
    
    return lintEl;
  }
  
  // Add linting on code changes
  editor.addEventListener('input', () => {
    if (lintingEnabled) {
      clearTimeout(editor.lintTimeout);
      editor.lintTimeout = setTimeout(showLintWarnings, 500);
    }
  });
  
  document.addEventListener('keydown', e=>{
    if((e.metaKey||e.ctrlKey) && e.key==='Enter') run();
  });

  function run(){
    runBtn.disabled = true; 
    status.textContent = 'Running...';
    const src = editor.value;
    const key = sel.value;
    const N = parseInt(nInput.value,10)||5;
    const expected = (patterns[key] ?? patterns.left)(N);

    // attempt subset pseudorun
    const res = pseudorunSubset(src, N);
    const your = res.output ?? "";
    
    // Show only student output in main area
    if (your) {
      outEl.textContent = your;
      // Compare with expected for feedback
      const {a} = diffLines(your, expected);
      renderAnnotated(outEl, a);
    } else {
      outEl.textContent = "No output generated. Check your code structure.";
    }

    const msgs = [];
    if(res.errors?.length) msgs.push(...res.errors);
    
    // The C++ interpreter now handles all pattern recognition and feedback

    // Better comparison - trim whitespace and normalize
    const yourTrimmed = your.trim();
    const expectedTrimmed = expected.trim();
    const isMatch = yourTrimmed === expectedTrimmed;
    
    
    fb.innerHTML = msgs.length ? msgs.map(m=>`• ${escapeHtml(m)}`).join("<br>") :
      (isMatch ? `<span class="ok">Perfect! ✅ Your pattern matches exactly!</span>` :
        `<span class="err">Pattern shape looks good, but try using "* " (asterisk + space) to match the expected output exactly.</span>`);

    status.textContent = 'Done.'; 
    status.className = 'status';
    runBtn.disabled = false;
  }
});
// C++ Linting functionality
class CppLinter {
  constructor() {
    this.enabled = false;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  lint(code) {
    if (!this.enabled) return [];

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
}
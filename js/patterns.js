// Pattern definitions and utilities
class PatternManager {
  constructor() {
    this.SP = "  ";
    this.STAR = "* ";
  }

  rep(s, k) {
    return Array.from({length: k}, () => s).join("");
  }

  range(a, b) {
    return Array.from({length: (b - a + 1)}, (_, k) => a + k);
  }

  // Pattern-specific hints
  getHints() {
    return {
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
  }

  // Pattern generators
  getPatterns() {
    return {
      left: (n) => this.range(1, n).map(i => this.rep(this.STAR, i)).join("\n"),
      hleft: (n) => this.range(1, n).map(i => {
        if (i === 1) return this.STAR;
        if (i === n) return this.rep(this.STAR, n);
        return this.STAR + this.rep("  ", i - 2) + this.STAR;
      }).join("\n"),
      dleft: (n) => this.range(1, n).map(i => this.rep(this.STAR, n - (i - 1))).join("\n"),
      dhleft: (n) => this.range(1, n).map(i => {
        const stars = n - (i - 1);
        if (i === 1) return this.rep(this.STAR, stars);
        if (stars === 1) return this.STAR;
        return this.STAR + this.rep("  ", stars - 2) + this.STAR;
      }).join("\n"),
      right: (n) => this.range(1, n).map(i => this.rep(this.SP, n - i) + this.rep(this.STAR, i)).join("\n"),
      hright: (n) => this.range(1, n).map(i => {
        if (i === 1) return this.rep(this.SP, n - 1) + this.STAR;
        if (i === n) return this.rep(this.STAR, n);
        return this.rep(this.SP, n - i) + this.STAR + this.rep("  ", i - 2) + this.STAR;
      }).join("\n"),
      dright: (n) => this.range(0, n - 1).map(k => this.rep(this.SP, k) + this.rep(this.STAR, n - k)).join("\n"),
      dhright: (n) => this.range(0, n - 1).map(k => {
        const stars = n - k;
        if (k === 0) return this.rep(this.STAR, n);
        if (stars === 1) return this.rep(this.SP, k) + this.STAR;
        return this.rep(this.SP, k) + this.STAR + this.rep("  ", stars - 2) + this.STAR;
      }).join("\n"),
      pyr: (n) => this.range(1, n).map(i => this.rep(this.SP, n - i) + this.rep(this.STAR, 2 * i - 1)).join("\n"),
      hpyr: (n) => this.range(1, n).map(i => {
        if (i === 1) return this.rep(this.SP, n - 1) + this.STAR;
        if (i === n) return this.rep(this.STAR, 2 * n - 1);
        return this.rep(this.SP, n - i) + this.STAR + this.rep("  ", 2 * i - 3) + this.STAR;
      }).join("\n"),
      dpyr: (n) => this.range(0, n - 1).map(k => this.rep(this.SP, k) + this.rep(this.STAR, 2 * (n - k) - 1)).join("\n"),
      hdpyr: (n) => this.range(0, n - 1).map(k => {
        const width = 2 * (n - k) - 1;
        if (k === 0) return this.rep(this.STAR, 2 * n - 1);
        if (width === 1) return this.rep(this.SP, k) + this.STAR;
        return this.rep(this.SP, k) + this.STAR + this.rep("  ", width - 2) + this.STAR;
      }).join("\n"),
      sq: (n) => this.range(1, n).map(() => this.rep(this.STAR, n)).join("\n"),
      hsq: (n) => this.range(1, n).map(i => {
        if (i === 1 || i === n) return this.rep(this.STAR, n);
        return this.STAR + this.rep("  ", n - 2) + this.STAR;
      }).join("\n"),
      xsq: (n) => this.range(1, n).map(i => {
        return this.range(1, n).map(j => {
          const border = (i === 1 || i === n || j === 1 || j === n);
          const diag = (i === j || i + j === n + 1);
          return (border || diag) ? this.STAR : "  ";
        }).join("");
      }).join("\n"),
      dia: (n) => {
        const up = this.range(1, n).map(i => this.rep(this.SP, n - i) + this.rep(this.STAR, 2 * i - 1)).join("\n");
        const down = this.range(1, n - 1).map(i => this.rep(this.SP, i) + this.rep(this.STAR, 2 * (n - i) - 1)).join("\n");
        return up + (n > 1 ? ("\n" + down) : "");
      },
      hdia: (n) => {
        const up = this.range(1, n).map(i => {
          if (i === 1) return this.rep(this.SP, n - 1) + this.STAR;
          return this.rep(this.SP, n - i) + this.STAR + this.rep("  ", 2 * i - 3) + this.STAR;
        }).join("\n");
        const down = this.range(1, n - 1).map(i => {
          const w = 2 * (n - i) - 1;
          if (w === 1) return this.rep(this.SP, i) + this.STAR;
          return this.rep(this.SP, i) + this.STAR + this.rep("  ", w - 2) + this.STAR;
        }).join("\n");
        return up + (n > 1 ? ("\n" + down) : "");
      }
    };
  }

  generatePattern(patternKey, n) {
    const patterns = this.getPatterns();
    const generator = patterns[patternKey] || patterns.left;
    return generator(n);
  }

  getHint(patternKey) {
    const hints = this.getHints();
    return hints[patternKey] || hints.left;
  }
}
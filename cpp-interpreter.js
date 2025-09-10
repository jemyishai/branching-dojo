// Educational C++ Interpreter for Pattern Exercises
// Handles basic for-loops, variables, cout statements

class Token {
  constructor(type, value, line = 0, column = 0) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

class Tokenizer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();
      if (this.pos >= this.source.length) break;

      const char = this.current();

      // Single-line comments
      if (char === '/' && this.peek() === '/') {
        this.skipLineComment();
        continue;
      }

      // String literals
      if (char === '"') {
        this.addStringToken();
        continue;
      }

      // Character literals
      if (char === "'") {
        this.addCharToken();
        continue;
      }

      // Numbers
      if (this.isDigit(char)) {
        this.addNumberToken();
        continue;
      }

      // Identifiers and keywords
      if (this.isAlpha(char) || char === '_') {
        this.addIdentifierToken();
        continue;
      }

      // Two-character operators
      if (this.addTwoCharOperator()) continue;

      // Single-character tokens
      this.addSingleCharToken();
    }

    this.tokens.push(new Token('EOF', '', this.line, this.column));
    return this.tokens;
  }

  current() {
    return this.source[this.pos];
  }

  peek(offset = 1) {
    return this.source[this.pos + offset] || '';
  }

  advance() {
    if (this.current() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.pos++;
  }

  skipWhitespace() {
    while (this.pos < this.source.length && /\s/.test(this.current())) {
      this.advance();
    }
  }

  skipLineComment() {
    while (this.pos < this.source.length && this.current() !== '\n') {
      this.advance();
    }
  }

  addStringToken() {
    const start = this.pos;
    this.advance(); // Skip opening quote
    let value = '';
    
    while (this.pos < this.source.length && this.current() !== '"') {
      if (this.current() === '\\') {
        this.advance();
        const escaped = this.current();
        if (escaped === 'n') value += '\n';
        else if (escaped === 't') value += '\t';
        else if (escaped === '\\') value += '\\';
        else if (escaped === '"') value += '"';
        else value += escaped;
      } else {
        value += this.current();
      }
      this.advance();
    }
    
    if (this.current() === '"') this.advance(); // Skip closing quote
    this.tokens.push(new Token('STRING', value, this.line, this.column));
  }

  addCharToken() {
    this.advance(); // Skip opening quote
    const value = this.current();
    this.advance(); // Skip character
    if (this.current() === "'") this.advance(); // Skip closing quote
    this.tokens.push(new Token('CHAR', value, this.line, this.column));
  }

  addNumberToken() {
    let value = '';
    while (this.pos < this.source.length && this.isDigit(this.current())) {
      value += this.current();
      this.advance();
    }
    this.tokens.push(new Token('NUMBER', parseInt(value), this.line, this.column));
  }

  addIdentifierToken() {
    let value = '';
    while (this.pos < this.source.length && (this.isAlphaNum(this.current()) || this.current() === '_')) {
      value += this.current();
      this.advance();
    }
    
    // Check if it's a keyword
    const keywords = ['int', 'char', 'for', 'if', 'else', 'while', 'return', 'cout', 'endl', 'using', 'namespace', 'std', 'include', 'main'];
    const type = keywords.includes(value) ? 'KEYWORD' : 'IDENTIFIER';
    this.tokens.push(new Token(type, value, this.line, this.column));
  }

  addTwoCharOperator() {
    const current = this.current();
    const next = this.peek();
    const twoChar = current + next;
    
    const operators = ['++', '--', '<=', '>=', '==', '!=', '<<', '>>', '&&', '||', '+=', '-=', '*=', '/='];
    if (operators.includes(twoChar)) {
      this.tokens.push(new Token('OPERATOR', twoChar, this.line, this.column));
      this.advance();
      this.advance();
      return true;
    }
    return false;
  }

  addSingleCharToken() {
    const char = this.current();
    const tokenMap = {
      '(': 'LPAREN', ')': 'RPAREN', '{': 'LBRACE', '}': 'RBRACE',
      ';': 'SEMICOLON', ',': 'COMMA', '=': 'ASSIGN',
      '+': 'OPERATOR', '-': 'OPERATOR', '*': 'OPERATOR', '/': 'OPERATOR',
      '<': 'OPERATOR', '>': 'OPERATOR', '!': 'OPERATOR',
      '#': 'HASH'
    };
    
    const type = tokenMap[char] || 'UNKNOWN';
    this.tokens.push(new Token(type, char, this.line, this.column));
    this.advance();
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  isAlpha(char) {
    return /[a-zA-Z]/.test(char);
  }

  isAlphaNum(char) {
    return /[a-zA-Z0-9]/.test(char);
  }
}

// AST Node Classes
class ASTNode {
  constructor(type) {
    this.type = type;
  }
}

class ProgramNode extends ASTNode {
  constructor(statements) {
    super('PROGRAM');
    this.statements = statements;
  }
}

class ForLoopNode extends ASTNode {
  constructor(init, condition, increment, body) {
    super('FOR_LOOP');
    this.init = init;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }
}

class VariableDeclarationNode extends ASTNode {
  constructor(varType, name, value = null) {
    super('VAR_DECLARATION');
    this.varType = varType;
    this.name = name;
    this.value = value;
  }
}

class CoutStatementNode extends ASTNode {
  constructor(expressions) {
    super('COUT');
    this.expressions = expressions;
  }
}

class BinaryOpNode extends ASTNode {
  constructor(left, operator, right) {
    super('BINARY_OP');
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

class UnaryOpNode extends ASTNode {
  constructor(operator, operand, prefix = true) {
    super('UNARY_OP');
    this.operator = operator;
    this.operand = operand;
    this.prefix = prefix;
  }
}

class AssignmentNode extends ASTNode {
  constructor(variable, operator, value) {
    super('ASSIGNMENT');
    this.variable = variable;
    this.operator = operator; // '=', '+=', '-=', etc.
    this.value = value;
  }
}

class IdentifierNode extends ASTNode {
  constructor(name) {
    super('IDENTIFIER');
    this.name = name;
  }
}

class LiteralNode extends ASTNode {
  constructor(value, literalType) {
    super('LITERAL');
    this.value = value;
    this.literalType = literalType; // 'NUMBER', 'STRING', 'CHAR'
  }
}

// Parser Implementation
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  parse() {
    const statements = [];
    
    // Skip includes and using statements
    this.skipPreprocessorAndUsing();
    
    // Find main function
    const mainFunc = this.parseMainFunction();
    if (mainFunc) {
      return new ProgramNode(mainFunc.body);
    }
    
    return new ProgramNode([]);
  }

  current() {
    return this.tokens[this.pos] || new Token('EOF', '');
  }

  peek(offset = 1) {
    return this.tokens[this.pos + offset] || new Token('EOF', '');
  }

  advance() {
    if (this.pos < this.tokens.length - 1) this.pos++;
  }

  match(type, value = null) {
    const token = this.current();
    return token.type === type && (value === null || token.value === value);
  }

  consume(type, value = null) {
    if (this.match(type, value)) {
      const token = this.current();
      this.advance();
      return token;
    }
    return null;
  }

  skipPreprocessorAndUsing() {
    while (this.current().type !== 'EOF') {
      if (this.match('HASH') || 
          (this.match('KEYWORD', 'using') || this.match('KEYWORD', 'namespace'))) {
        // Skip to end of line/statement
        while (this.current().type !== 'EOF' && this.current().value !== '\n' && this.current().value !== ';') {
          this.advance();
        }
        if (this.match('SEMICOLON')) this.advance();
      } else {
        break;
      }
    }
  }

  parseMainFunction() {
    // Look for: int main() {
    if (!this.consume('KEYWORD', 'int')) return null;
    if (!this.consume('KEYWORD', 'main')) return null;
    if (!this.consume('LPAREN')) return null;
    if (!this.consume('RPAREN')) return null;
    if (!this.consume('LBRACE')) return null;
    
    const body = this.parseStatements();
    return { body };
  }

  parseStatements() {
    const statements = [];
    
    while (!this.match('RBRACE') && this.current().type !== 'EOF') {
      const stmt = this.parseStatement();
      if (stmt) statements.push(stmt);
    }
    
    return statements;
  }

  parseStatement() {
    // Variable declaration
    if (this.match('KEYWORD', 'int') || this.match('KEYWORD', 'char')) {
      return this.parseVariableDeclaration();
    }
    
    // For loop
    if (this.match('KEYWORD', 'for')) {
      return this.parseForLoop();
    }
    
    // Cout statement
    if (this.match('KEYWORD', 'cout')) {
      return this.parseCoutStatement();
    }
    
    // Assignment statement (e.g., output+=1)
    if (this.match('IDENTIFIER')) {
      return this.parseAssignmentStatement();
    }
    
    // Return statement
    if (this.match('KEYWORD', 'return')) {
      this.advance();
      while (!this.match('SEMICOLON') && this.current().type !== 'EOF') {
        this.advance();
      }
      this.consume('SEMICOLON');
      return null; // Ignore return statements
    }
    
    // Skip unknown statements
    while (!this.match('SEMICOLON') && !this.match('LBRACE') && this.current().type !== 'EOF') {
      this.advance();
    }
    if (this.match('SEMICOLON')) this.advance();
    
    return null;
  }

  parseAssignmentStatement() {
    const variable = this.current().value;
    this.advance();
    
    const operator = this.current().value; // '=', '+=', '-=', etc.
    this.advance();
    
    const value = this.parseExpression();
    this.consume('SEMICOLON');
    
    return new AssignmentNode(variable, operator, value);
  }

  parseVariableDeclaration() {
    const varType = this.current().value;
    this.advance();
    
    const name = this.current().value;
    this.advance();
    
    let value = null;
    if (this.consume('ASSIGN')) {
      value = this.parseExpression();
    }
    
    this.consume('SEMICOLON');
    return new VariableDeclarationNode(varType, name, value);
  }

  parseForLoop() {
    this.consume('KEYWORD', 'for');
    this.consume('LPAREN');
    
    // Parse init (can be declaration or assignment)
    const init = this.parseStatement();
    
    // Parse condition
    const condition = this.parseExpression();
    this.consume('SEMICOLON');
    
    // Parse increment
    const increment = this.parseExpression();
    this.consume('RPAREN');
    
    // Parse body
    const body = this.parseBlock();
    
    return new ForLoopNode(init, condition, increment, body);
  }

  parseBlock() {
    if (this.consume('LBRACE')) {
      const statements = this.parseStatements();
      this.consume('RBRACE');
      return statements;
    } else {
      // Single statement
      const stmt = this.parseStatement();
      return stmt ? [stmt] : [];
    }
  }

  parseCoutStatement() {
    this.consume('KEYWORD', 'cout');
    const expressions = [];
    
    while (this.match('OPERATOR', '<<')) {
      this.advance(); // consume <<
      expressions.push(this.parseExpression());
    }
    
    this.consume('SEMICOLON');
    return new CoutStatementNode(expressions);
  }

  parseExpression() {
    return this.parseComparison();
  }

  parseComparison() {
    let expr = this.parseAddition();
    
    while (this.match('OPERATOR') && ['<=', '>=', '<', '>', '==', '!='].includes(this.current().value)) {
      const op = this.current().value;
      this.advance();
      const right = this.parseAddition();
      expr = new BinaryOpNode(expr, op, right);
    }
    
    return expr;
  }

  parseAddition() {
    let expr = this.parseMultiplication();
    
    while (this.match('OPERATOR') && ['+', '-'].includes(this.current().value)) {
      const op = this.current().value;
      this.advance();
      const right = this.parseMultiplication();
      expr = new BinaryOpNode(expr, op, right);
    }
    
    return expr;
  }

  parseMultiplication() {
    let expr = this.parseUnary();
    
    while (this.match('OPERATOR') && ['*', '/', '%'].includes(this.current().value)) {
      const op = this.current().value;
      this.advance();
      const right = this.parseUnary();
      expr = new BinaryOpNode(expr, op, right);
    }
    
    return expr;
  }

  parseUnary() {
    // Prefix increment/decrement
    if (this.match('OPERATOR', '++') || this.match('OPERATOR', '--')) {
      const op = this.current().value;
      this.advance();
      const operand = this.parsePrimary();
      return new UnaryOpNode(op, operand, true);
    }
    
    let expr = this.parsePrimary();
    
    // Postfix increment/decrement
    if (this.match('OPERATOR', '++') || this.match('OPERATOR', '--')) {
      const op = this.current().value;
      this.advance();
      expr = new UnaryOpNode(op, expr, false);
    }
    
    return expr;
  }

  parsePrimary() {
    // Parenthesized expression
    if (this.consume('LPAREN')) {
      const expr = this.parseExpression();
      this.consume('RPAREN');
      return expr;
    }
    
    // Number literal
    if (this.match('NUMBER')) {
      const value = this.current().value;
      this.advance();
      return new LiteralNode(value, 'NUMBER');
    }
    
    // String literal
    if (this.match('STRING')) {
      const value = this.current().value;
      this.advance();
      return new LiteralNode(value, 'STRING');
    }
    
    // Character literal
    if (this.match('CHAR')) {
      const value = this.current().value;
      this.advance();
      return new LiteralNode(value, 'CHAR');
    }
    
    // Identifier or endl keyword
    if (this.match('IDENTIFIER') || (this.match('KEYWORD') && this.current().value === 'endl')) {
      const name = this.current().value;
      this.advance();
      return new IdentifierNode(name);
    }
    
    // Skip unknown tokens
    this.advance();
    return null;
  }
}

// Interpreter Implementation
class Interpreter {
  constructor() {
    this.variables = new Map();
    this.output = '';
    this.maxIterations = 10000; // Safety limit
    this.iterations = 0;
  }

  execute(program) {
    this.output = '';
    this.iterations = 0;
    
    try {
      for (const statement of program.statements) {
        this.executeStatement(statement);
      }
      return { output: this.output, success: true };
    } catch (error) {
      return { output: null, success: false, error: error.message };
    }
  }

  executeStatement(node) {
    if (!node) return;
    
    switch (node.type) {
      case 'VAR_DECLARATION':
        this.executeVariableDeclaration(node);
        break;
      case 'FOR_LOOP':
        this.executeForLoop(node);
        break;
      case 'COUT':
        this.executeCoutStatement(node);
        break;
      case 'ASSIGNMENT':
        this.executeAssignment(node);
        break;
    }
  }

  executeVariableDeclaration(node) {
    let value = 0;
    if (node.value) {
      value = this.evaluateExpression(node.value);
    }
    this.variables.set(node.name, value);
  }

  executeAssignment(node) {
    const currentValue = this.variables.get(node.variable) || 0;
    const newValue = this.evaluateExpression(node.value);
    
    let result;
    switch (node.operator) {
      case '=':
        result = newValue;
        break;
      case '+=':
        result = currentValue + newValue;
        break;
      case '-=':
        result = currentValue - newValue;
        break;
      case '*=':
        result = currentValue * newValue;
        break;
      case '/=':
        result = Math.floor(currentValue / newValue);
        break;
      default:
        result = newValue;
    }
    
    this.variables.set(node.variable, result);
  }

  executeForLoop(node) {
    // Execute initialization
    if (node.init) {
      this.executeStatement(node.init);
    }
    
    // Loop execution
    while (this.evaluateExpression(node.condition)) {
      this.iterations++;
      if (this.iterations > this.maxIterations) {
        throw new Error('Too many iterations - possible infinite loop');
      }
      
      // Execute body
      for (const stmt of node.body) {
        this.executeStatement(stmt);
      }
      
      // Execute increment
      if (node.increment) {
        this.evaluateExpression(node.increment);
      }
    }
  }

  executeCoutStatement(node) {
    for (const expr of node.expressions) {
      const value = this.evaluateExpression(expr);
      this.output += this.toString(value);
    }
  }

  evaluateExpression(node) {
    if (!node) return 0;
    
    switch (node.type) {
      case 'LITERAL':
        return node.literalType === 'CHAR' ? node.value.charCodeAt(0) : node.value;
      case 'IDENTIFIER':
        // Handle endl as a special case
        if (node.name === 'endl') {
          return '\n';
        }
        return this.variables.get(node.name) || 0;
      case 'BINARY_OP':
        return this.evaluateBinaryOp(node);
      case 'UNARY_OP':
        return this.evaluateUnaryOp(node);
      default:
        return 0;
    }
  }

  evaluateBinaryOp(node) {
    const left = this.evaluateExpression(node.left);
    const right = this.evaluateExpression(node.right);
    
    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return Math.floor(left / right);
      case '%': return left % right;
      case '<=': return left <= right;
      case '>=': return left >= right;
      case '<': return left < right;
      case '>': return left > right;
      case '==': return left === right;
      case '!=': return left !== right;
      default: return 0;
    }
  }

  evaluateUnaryOp(node) {
    const varName = node.operand.name;
    const currentValue = this.variables.get(varName) || 0;
    
    switch (node.operator) {
      case '++':
        if (node.prefix) {
          const newValue = currentValue + 1;
          this.variables.set(varName, newValue);
          return newValue;
        } else {
          this.variables.set(varName, currentValue + 1);
          return currentValue;
        }
      case '--':
        if (node.prefix) {
          const newValue = currentValue - 1;
          this.variables.set(varName, newValue);
          return newValue;
        } else {
          this.variables.set(varName, currentValue - 1);
          return currentValue;
        }
      default:
        return currentValue;
    }
  }

  toString(value) {
    if (typeof value === 'string') {
      return value;  // Return strings directly (including '\n' from endl)
    }
    if (typeof value === 'number') {
      // Check if it's a character code
      if (value >= 32 && value <= 126) {
        return String.fromCharCode(value);
      }
      return value.toString();
    }
    return value.toString();
  }
}

// Main execution function
function executeCppCode(source, N = 5) {
  try {
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();
    
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    const interpreter = new Interpreter();
    
    // Set N variable if not already declared
    interpreter.variables.set('N', N);
    
    const result = interpreter.execute(ast);
    
    return result;
  } catch (error) {
    console.error('Interpreter error:', error);
    return { output: null, success: false, error: error.message };
  }
}
// Application state management
class AppState {
  constructor() {
    this.state = {
      selectedPattern: 'left',
      n: 5,
      code: '',
      lintingEnabled: false,
      output: '',
      lintWarnings: []
    };
    this.listeners = [];
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state changes
  notify(changes) {
    this.listeners.forEach(listener => listener(this.state, changes));
  }

  // Update state with partial updates
  setState(updates) {
    const oldState = {...this.state};
    this.state = {...this.state, ...updates};
    this.notify({...updates, _prevState: oldState});
  }

  getState() {
    return {...this.state};
  }

  // Specific state updaters
  setPattern(pattern) {
    this.setState({selectedPattern: pattern});
  }

  setN(n) {
    this.setState({n: parseInt(n, 10) || 5});
  }

  setCode(code) {
    this.setState({code});
  }

  setLinting(enabled) {
    this.setState({lintingEnabled: enabled});
  }

  setOutput(output) {
    this.setState({output});
  }

  setLintWarnings(warnings) {
    this.setState({lintWarnings: warnings});
  }
}
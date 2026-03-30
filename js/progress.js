// Progress Tracking — localStorage only, no server
// Stores: { patternKey: { completed: bool, attempts: N, firstCompletedAt: timestamp } }

const ALL_PATTERNS = [
  'left','hleft','dleft','dhleft',
  'right','hright','dright','dhright',
  'pyr','hpyr','dpyr','hdpyr',
  'sq','hsq','xsq','dia','hdia'
];

class ProgressTracker {
  constructor() {
    this.KEY = 'dojo-progress';
    this._listeners = [];
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '{}');
    } catch { return {}; }
  }

  _save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
    this._listeners.forEach(cb => cb(this.getProgress()));
  }

  onChange(cb) {
    this._listeners.push(cb);
  }

  recordAttempt(patternKey) {
    const data = this._load();
    if (!data[patternKey]) data[patternKey] = { completed: false, attempts: 0 };
    data[patternKey].attempts = (data[patternKey].attempts || 0) + 1;
    this._save(data);
  }

  // Returns true if this is the FIRST completion
  recordCompletion(patternKey) {
    const data = this._load();
    if (!data[patternKey]) data[patternKey] = { completed: false, attempts: 0 };
    const alreadyDone = data[patternKey].completed;
    if (!alreadyDone) {
      data[patternKey].completed = true;
      data[patternKey].firstCompletedAt = Date.now();
      this._save(data);
      return true; // newly completed
    }
    return false;
  }

  isCompleted(patternKey) {
    const data = this._load();
    return !!(data[patternKey]?.completed);
  }

  getProgress() {
    const data = this._load();
    const total = ALL_PATTERNS.length;
    const done = ALL_PATTERNS.filter(k => data[k]?.completed).length;
    return { done, total };
  }

  getAllData() {
    return this._load();
  }

  reset() {
    localStorage.removeItem(this.KEY);
    this._listeners.forEach(cb => cb({ done: 0, total: ALL_PATTERNS.length }));
  }
}

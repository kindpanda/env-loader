class Environment {
  constructor({ prefix = '' } = {}) {
    this.prefix = prefix;
  }

  getKey(variable) {
    return `${this.prefix}${variable}`;
  }

  get(variable, defaultValue = null) {
    const key = this.getKey(variable);
    return this.has(variable) ? process.env[key] : defaultValue;
  }

  getBoolean(variable, defaultValue = false) {
    const key = this.getKey(variable);
    const value = this.has(variable) ? process.env[key] : defaultValue;
    return value === '1' || value === 1 || value === 'true' || value === true;
  }

  has(variable) {
    const key = this.getKey(variable);
    return Object.prototype.hasOwnProperty.call(process.env, key);
  }

  getMissingVariables(variables) {
    return variables.filter(v => !this.has(v));
  }
}

export default Environment;

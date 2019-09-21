import path from 'path';
import loadEnv from '../src/';

const dataPath = path.resolve(__dirname, 'data');
const originalDebug = console.debug;

describe('checking args works', () => {
  it('throw an error when envPath is not defined', () => {
    expect.assertions(4);
    try {
      loadEnv();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
      expect(error.message).toBe('envPath is required');
    }
  });

  it('throw an error when envPath is not a valid path', () => {
    expect.assertions(4);
    try {
      loadEnv('/not-exists');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
      expect(error.message).toBe('envPath does not exists');
    }
  });

  it('throw an error when envPath is not a folder', () => {
    expect.assertions(4);
    try {
      loadEnv(path.resolve(__dirname, 'loadEnv.test.js'));
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
      expect(error.message).toBe('envPath is not a directory');
    }
  });

  it('throw an error when environment is not defined', () => {
    expect.assertions(4);
    try {
      loadEnv(dataPath, '');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
      expect(error.message).toBe('environment is required');
    }
  });
});

describe('overrides works', () => {
  let consoleOutput = [];
  const mockedWarn = output => consoleOutput.push(output);
  beforeEach(() => {
    consoleOutput = [];
    console.debug = mockedWarn;
  });

  afterEach(() => {
    console.debug = originalDebug;
  });

  it('works', () => {
    const overrides = loadEnv(dataPath, 'test');
    expect(overrides).toBeInstanceOf(Array);
    expect(overrides.sort()).toEqual(
      ['MY_ENV_VAR_NOT_OVERRIDEN', 'MY_ENV_VAR_OVERRIDEN_BY_ENV', 'MY_ENV_VAR_OVERRIDEN_BY_LOCAL'].sort(),
    );
    expect(process.env.MY_ENV_VAR_NOT_OVERRIDEN).toBe('from .env');
    expect(process.env.MY_ENV_VAR_OVERRIDEN_BY_ENV).toBe('from .env.test');
    expect(process.env.MY_ENV_VAR_OVERRIDEN_BY_LOCAL).toBe('from .env.test.local');
  });

  it('output in console when silent option is disabled', () => {
    loadEnv(dataPath, 'test', false);
    expect(consoleOutput.length).toBe(1);
    expect(consoleOutput[0]).toBe('Environment variables overrided from dotfile');
  });
});

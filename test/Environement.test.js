import { Environment } from '../src';
describe('Environment class', () => {
  describe('prefix constructor options', () => {
    it('has default empty prefix', () => {
      const instance = new Environment();
      expect(instance.prefix).toBe('');
    });

    it('has handle custom prefix', () => {
      const instance = new Environment({ prefix: 'PANDA_' });
      expect(instance.prefix).toBe('PANDA_');
    });
  });

  it('get key with prefix prefix', () => {
    const instance = new Environment();
    expect(instance.getKey('VARNAME')).toBe('VARNAME');

    const instanceWithPrefix = new Environment({ prefix: 'PANDA_' });
    expect(instanceWithPrefix.getKey('VARNAME')).toBe('PANDA_VARNAME');
  });

  describe('Getting env var', () => {
    beforeAll(() => {
      process.env.__TEST_VAR__ = 'test_value';
      process.env.PANDA___TEST_VAR__ = 'test_value_panda';
    });
    afterAll(() => {
      process.env.__TEST_VAR__ = undefined;
      process.env.PANDA___TEST_VAR__ = undefined;
    });

    it('return default value when env var is not defined', () => {
      const instance = new Environment();
      expect(instance.get('NOT_EXISTS', 'default_value')).toBe('default_value');
    });

    it('return env value when it is defined', () => {
      const instance = new Environment();
      expect(instance.get('__TEST_VAR__', 'default_value')).toBe('test_value');

      const instanceWithPrefix = new Environment({ prefix: 'PANDA_' });
      expect(instanceWithPrefix.get('__TEST_VAR__', 'default_value')).toBe('test_value_panda');
    });
  });

  describe('Getting boolean env var', () => {
    beforeAll(() => {
      process.env.__BOOL_STRING_TRUE = 'true';
      process.env.__BOOL_STRING_1 = '1';
      process.env.__BOOL_TRUE = true;
      process.env.__BOOL_1 = 1;
      process.env.__BOOL_STRING_FALSE = 'false';
      process.env.__BOOL_STRING_0 = '0';
      process.env.__BOOL_STRING_ANYTHING = 'lorem ipsum';
    });
    afterAll(() => {
      process.env.__BOOL_STRING_TRUE = undefined;
      process.env.__BOOL_STRING_1 = undefined;
      process.env.__BOOL_TRUE = undefined;
      process.env.__BOOL_1 = undefined;
      process.env.__BOOL_STRING_FALSE = undefined;
      process.env.__BOOL_STRING_0 = undefined;
      process.env.__BOOL_STRING_ANYTHING = undefined;
    });

    it('return default value when env var is not defined', () => {
      const instance = new Environment();
      expect(instance.getBoolean('__BOOL_STRING_TRUE', null)).toBe(true);
      expect(instance.getBoolean('__BOOL_STRING_1', null)).toBe(true);
      expect(instance.getBoolean('__BOOL_TRUE', null)).toBe(true);
      expect(instance.getBoolean('__BOOL_1', null)).toBe(true);
      expect(instance.getBoolean('__BOOL_STRING_FALSE', null)).toBe(false);
      expect(instance.getBoolean('__BOOL_STRING_0', null)).toBe(false);
      expect(instance.getBoolean('__BOOL_STRING_ANYTHING', null)).toBe(false);
    });
  });

  describe('Getting boolean env var', () => {
    beforeAll(() => {
      process.env.__EXISTING_VAR__ = 'I exist';
    });
    afterAll(() => {
      process.env.__EXISTING_VAR__ = undefined;
    });

    it('return list of missing var', () => {
      const instance = new Environment();
      const missing = instance.getMissingVariables(['__EXISTING_VAR__', '__NOT_SET__']);
      expect(missing.sort()).toEqual(['__NOT_SET__'].sort());
    });
  });
});

/* eslint-disable @typescript-eslint/no-var-requires */
describe('getEnvConfig', () => {
    const ORIGINAL_ENV = process.env.APP_ENV;
  
    afterEach(() => {
      if (ORIGINAL_ENV === undefined) delete process.env.APP_ENV;
      else process.env.APP_ENV = ORIGINAL_ENV;
      jest.resetModules();
    });
  
    it('returns the local config by default', () => {
      delete process.env.APP_ENV;
      jest.isolateModules(() => {
        const { getEnvConfig } = require('./getEnvConfig');
        expect(getEnvConfig().envName).toBe('local');
      });
    });
  
    it.each(['dev', 'qacert', 'prod'] as const)('returns the %s config', (name) => {
      process.env.APP_ENV = name;
      jest.isolateModules(() => {
        const { getEnvConfig } = require('./getEnvConfig');
        expect(getEnvConfig().envName).toBe(name);
      });
    });
  
    it('falls back to local for an unknown APP_ENV value', () => {
      process.env.APP_ENV = 'staging-unknown';
      jest.isolateModules(() => {
        const { getEnvConfig } = require('./getEnvConfig');
        expect(getEnvConfig().envName).toBe('local');
      });
    });
  });
  
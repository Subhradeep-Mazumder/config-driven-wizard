/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('axios', () => {
    const interceptorUseMock = jest.fn();
    const createMock = jest.fn(() => ({
      interceptors: { request: { use: interceptorUseMock } },
    }));
    return {
      __esModule: true,
      default: { create: createMock },
      create: createMock,
      _interceptorUseMock: interceptorUseMock,
      _createMock: createMock,
    };
  });
  
  jest.mock('@/common/configs', () => ({
    getEnvConfig: () => ({
      envName: 'local',
      apiBaseUrl: 'http://localhost:4300',
      sseUrl: 'http://localhost:4300/events',
      requestTimeoutMs: 1234,
    }),
  }));
  
  type InterceptorFn = (config: {
    headers: Record<string, string>;
  }) => { headers: Record<string, string> };
  
  describe('getHttpClient', () => {
    beforeEach(() => {
      sessionStorage.clear();
      jest.resetModules();
      jest.clearAllMocks();
    });
  
    it('creates a singleton axios instance with baseURL + timeout', () => {
      const axiosMock = require('axios');
      jest.isolateModules(() => {
        const { getHttpClient } = require('./client');
        const a = getHttpClient();
        const b = getHttpClient();
        expect(a).toBe(b);
        expect(axiosMock._createMock).toHaveBeenCalledTimes(1);
        expect(axiosMock._createMock).toHaveBeenCalledWith(
          expect.objectContaining({
            baseURL: 'http://localhost:4300',
            timeout: 1234,
          }),
        );
      });
    });
  
    it('attaches Authorization header when a valid session is persisted', () => {
      sessionStorage.setItem(
        'persist:config-driven-wizard',
        JSON.stringify({ auth: JSON.stringify({ token: 'abc123' }) }),
      );
      const axiosMock = require('axios');
      jest.isolateModules(() => {
        const { getHttpClient } = require('./client');
        getHttpClient();
        const interceptor: InterceptorFn = axiosMock._interceptorUseMock.mock.calls[0][0];
        const out = interceptor({ headers: {} });
        expect(out.headers.Authorization).toBe('Bearer abc123');
      });
    });
  
    it('leaves Authorization unset when no session is persisted', () => {
      const axiosMock = require('axios');
      jest.isolateModules(() => {
        const { getHttpClient } = require('./client');
        getHttpClient();
        const interceptor: InterceptorFn = axiosMock._interceptorUseMock.mock.calls[0][0];
        const out = interceptor({ headers: {} });
        expect(out.headers.Authorization).toBeUndefined();
      });
    });
  
    it('swallows parse errors silently', () => {
      sessionStorage.setItem('persist:config-driven-wizard', '{not json');
      const axiosMock = require('axios');
      jest.isolateModules(() => {
        const { getHttpClient } = require('./client');
        getHttpClient();
        const interceptor: InterceptorFn = axiosMock._interceptorUseMock.mock.calls[0][0];
        expect(() => interceptor({ headers: {} })).not.toThrow();
      });
    });
  
    it('ignores persisted envelope without auth', () => {
      sessionStorage.setItem(
        'persist:config-driven-wizard',
        JSON.stringify({ wizard: JSON.stringify({ values: {} }) }),
      );
      const axiosMock = require('axios');
      jest.isolateModules(() => {
        const { getHttpClient } = require('./client');
        getHttpClient();
        const interceptor: InterceptorFn = axiosMock._interceptorUseMock.mock.calls[0][0];
        const out = interceptor({ headers: {} });
        expect(out.headers.Authorization).toBeUndefined();
      });
    });
  });
  
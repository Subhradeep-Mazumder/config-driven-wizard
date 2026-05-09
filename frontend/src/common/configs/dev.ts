import type { EnvConfig } from './index';

const config: EnvConfig = {
  envName: 'dev',
  apiBaseUrl: 'https://dev-api.example.com',
  sseUrl: 'https://dev-api.example.com/events',
  requestTimeoutMs: 15000,
};

export default config;

import type { EnvConfig } from './index';

const config: EnvConfig = {
  envName: 'qacert',
  apiBaseUrl: 'https://qa-api.example.com',
  sseUrl: 'https://qa-api.example.com/events',
  requestTimeoutMs: 20000,
};

export default config;

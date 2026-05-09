import type { EnvConfig } from './index';

const config: EnvConfig = {
  envName: 'prod',
  apiBaseUrl: 'https://api.example.com',
  sseUrl: 'https://api.example.com/events',
  requestTimeoutMs: 20000,
};

export default config;

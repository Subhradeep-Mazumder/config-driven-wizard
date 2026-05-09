import type { EnvConfig } from './index';

const config: EnvConfig = {
  envName: 'local',
  apiBaseUrl: 'http://localhost:4300',
  sseUrl: 'http://localhost:4300/events',
  requestTimeoutMs: 15000,
};

export default config;

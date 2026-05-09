export type EnvName = 'local' | 'dev' | 'qacert' | 'prod';

export interface EnvConfig {
  envName: EnvName;
  apiBaseUrl: string;
  sseUrl: string;
  requestTimeoutMs: number;
}

export { default as getEnvConfig } from './getEnvConfig';

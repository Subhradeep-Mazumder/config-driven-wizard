import type { EnvConfig, EnvName } from './index';
import local from './local';
import dev from './dev';
import qacert from './qacert';
import prod from './prod';

const map: Record<EnvName, EnvConfig> = { local, dev, qacert, prod };

export function getEnvConfig(): EnvConfig {
  const raw = (typeof process !== 'undefined' && process.env?.APP_ENV) || 'local';
  const env = (raw as EnvName) in map ? (raw as EnvName) : 'local';
  return map[env];
}

export default getEnvConfig;

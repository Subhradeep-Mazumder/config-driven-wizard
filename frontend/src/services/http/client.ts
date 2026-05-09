import axios, { AxiosInstance } from 'axios';
import { getEnvConfig } from '@/common/configs';

let instance: AxiosInstance | null = null;

export function getHttpClient(): AxiosInstance {
  if (instance) return instance;
  const { apiBaseUrl, requestTimeoutMs } = getEnvConfig();
  instance = axios.create({
    baseURL: apiBaseUrl,
    timeout: requestTimeoutMs,
    headers: { 'Content-Type': 'application/json' },
  });
  instance.interceptors.request.use((config) => {
    try {
      const raw = sessionStorage.getItem('persist:config-driven-wizard');
      if (raw) {
        const persisted = JSON.parse(raw);
        const auth = persisted?.auth ? JSON.parse(persisted.auth) : null;
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
      }
    } catch {
      // no-op: unauthenticated request
    }
    return config;
  });
  return instance;
}

export default getHttpClient;

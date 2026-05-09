declare module '*.scss';
declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ENV?: 'local' | 'dev' | 'qacert' | 'prod';
    API_BASE_URL?: string;
    SSE_URL?: string;
  }
}

import type { ReactNode } from 'react';

export type ErrorBannerSeverity = 'error' | 'warning' | 'info' | 'success';

export interface ErrorBannerProps {
  message: ReactNode;
  title?: ReactNode;
  severity?: ErrorBannerSeverity;
  onDismiss?: () => void;
  onRetry?: () => void;
  retryLabel?: string;
  dismissLabel?: string;
  className?: string;
}

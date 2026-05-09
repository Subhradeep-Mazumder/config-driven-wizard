import { Alert, AlertTitle, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ErrorBannerProps } from './errorBanner.d';
import './errorBanner.scss';

export function ErrorBanner({
  message,
  title,
  severity = 'error',
  onDismiss,
  onRetry,
  retryLabel = 'Retry',
  dismissLabel = 'Dismiss',
  className,
}: ErrorBannerProps) {
  const classes = ['errorBanner', className].filter(Boolean).join(' ');

  const action = onRetry || onDismiss ? (
    <div className="errorBanner__actions">
      {onRetry && (
        <Button size="small" color="inherit" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
      {onDismiss && (
        <IconButton size="small" color="inherit" aria-label={dismissLabel} onClick={onDismiss}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  ) : undefined;

  return (
    <Alert severity={severity} className={classes} role="alert" action={action}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
}

export default ErrorBanner;

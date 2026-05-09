import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/store';
import type { RequireAuthProps } from './requireAuth.d';
import './requireAuth.scss';

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const location = useLocation();
  const { user, token, expiresAt } = useAppSelector((s) => s.auth);
  const authed = Boolean(user && token && (!expiresAt || expiresAt > Date.now()));

  if (!authed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return (
      <div className="require-auth__forbidden" role="alert">
        <h2>403 — Forbidden</h2>
        <p>Your role does not have access to this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireAuth;

import { FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '@/common/components/button';
import useAuth from '@/common/utills/hooks/useAuth';
import type { LoginFormState } from './login.d';
import './login.scss';

export function Login() {
  const { t } = useTranslation();
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<LoginFormState>({ username: '', password: '' });

  if (isAuthenticated) {
    const redirect = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';
    navigate(redirect, { replace: true });
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(form.username.trim(), form.password);
      navigate('/', { replace: true });
    } catch {
      // error surfaced via useAuth()
    }
  };

  return (
    <section className="login" aria-labelledby="login-title">
      <h1 id="login-title" className="login__title">
        {t('login.title')}
      </h1>
      <form onSubmit={onSubmit} noValidate>
        <div className="login__row">
          <TextField
            id="username"
            label={t('login.username')}
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
            autoComplete="username"
            inputProps={{ 'aria-required': true }}
          />
        </div>
        <div className="login__row">
          <TextField
            id="password"
            label={t('login.password')}
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            autoComplete="current-password"
            inputProps={{ 'aria-required': true }}
          />
        </div>
        <Button type="submit" disabled={loading} ariaLabel={t('login.submit')}>
          {loading ? t('login.submitting') : t('login.submit')}
        </Button>
        {error && (
          <div role="alert" className="login__error">
            {error}
          </div>
        )}
        <p className="login__hint">{t('login.hint')}</p>
      </form>
    </section>
  );
}

export default Login;

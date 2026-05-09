import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Button from '@/common/components/button';
import useAuth from '@/common/utills/hooks/useAuth';
import type { HeaderProps } from './header.d';
import './header.scss';

export function Header({ className }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const onChangeLang = (e: SelectChangeEvent<string>) => {
    i18n.changeLanguage(e.target.value);
  };

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={['header', className].filter(Boolean).join(' ')} role="banner">
      <a className="header__skip" href="#main-content">
        {t('header.skipToContent')}
      </a>
      <div className="header__title">{t('app.title')}</div>
      <nav className="header__actions" aria-label={t('header.nav')}>
        <Select
          size="small"
          value={(i18n.language ?? 'en').startsWith('es') ? 'es' : 'en'}
          onChange={onChangeLang}
          inputProps={{ 'aria-label': t('header.language') }}
          sx={{ color: '#fff', borderColor: '#fff', '.MuiSvgIcon-root': { color: '#fff' } }}
        >
          <MenuItem value="en">EN</MenuItem>
          <MenuItem value="es">ES</MenuItem>
        </Select>
        {isAuthenticated && user && (
          <>
            <span aria-live="polite">{t('header.greeting', { name: user.username })}</span>
            <Button variant="outlined" color="secondary" onClick={onLogout}>
              {t('header.logout')}
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;

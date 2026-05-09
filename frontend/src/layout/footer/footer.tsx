import { useTranslation } from 'react-i18next';
import type { FooterProps } from './footer.d';
import './footer.scss';

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation();
  return (
    <footer className={['footer', className].filter(Boolean).join(' ')} role="contentinfo">
      <small>{t('footer.copy', { year: new Date().getFullYear() })}</small>
    </footer>
  );
}

export default Footer;

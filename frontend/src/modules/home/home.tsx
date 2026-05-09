import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/common/components/button';
import useAuth from '@/common/utills/hooks/useAuth';
import './home.scss';

export function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="home" aria-labelledby="home-title">
      <h1 id="home-title" className="home__title">
        {t('home.welcome', { name: user?.username ?? '' })}
      </h1>
      <p>{t('home.intro')}</p>
      <div className="home__actions">
        <Button onClick={() => navigate('/wizard')}>{t('home.startWizard')}</Button>
      </div>
    </section>
  );
}

export default Home;

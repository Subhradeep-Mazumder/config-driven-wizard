import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Header from './layout/header';
import Footer from './layout/footer';
import RequireAuth from './common/components/requireAuth';
import './app.scss';

const Home = lazy(() => import('./modules/home'));
const Login = lazy(() => import('./modules/login'));
const WizardBuilder = lazy(() => import('./modules/wizard'));

function RouteFallback() {
  return (
    <div className="app__fallback" role="status" aria-live="polite">
      <CircularProgress aria-label="Loading" />
    </div>
  );
}

export function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__main" id="main-content" role="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/wizard"
              element={
                <RequireAuth>
                  <WizardBuilder />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;

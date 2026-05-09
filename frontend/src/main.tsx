import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store, persistor } from './store/store';
import App from './app';
import './i18n';

const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#1976d2' } },
});

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);

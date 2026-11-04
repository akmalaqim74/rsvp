import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { I18nProvider } from './lib/i18n';
import { ConfigProvider } from './lib/siteConfig';
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/inter/wght.css';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('root element missing');

createRoot(root).render(
  <StrictMode>
    {/* reducedMotion "user": people who ask their phone for less motion get no movement, only fades */}
    <MotionConfig reducedMotion="user"><LazyMotion features={domAnimation} strict>
      <I18nProvider>
        <ConfigProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfigProvider>
      </I18nProvider>
    </LazyMotion></MotionConfig>
  </StrictMode>
);

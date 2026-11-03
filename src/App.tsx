import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { How, Events, Demo, Get, Faq } from './components/Sections';
import { Booking } from './components/Booking';
import { Footer } from './components/Footer';
import { useI18n } from './lib/i18n';

export function App() {
  const { t } = useI18n();
  return (
    <>
      <a className="skip" href="#book">{t('cta.book')}</a>
      <Header />
      <main>
        <Hero />
        <How />
        <Events />
        <Demo />
        <Get />
        <Booking />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

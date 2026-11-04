import { m } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { WhatsAppLink } from './WhatsAppLink';
import { CoverThumb, themeStyle } from './card/parts';
import { findDemo } from '../demos/data';
import '../invitation.css';

const SAMPLE = findDemo('wedding', 'id-1');

const item = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.1 + i * 0.1, ease: 'easeOut' as const }
});

export function Hero() {
  const { t, lang } = useI18n();
  return (
    <section className="hero wrap">
      <div className="hero-text">
        <m.h1 {...item(0)}>{t('hero.title')}</m.h1>
        <m.p className="lead" {...item(1)}>{t('hero.sub')}</m.p>
        <m.div className="cta-row" {...item(2)}>
          <WhatsAppLink className="btn btn-wa">{t('cta.wa')}</WhatsAppLink>
          <m.a className="btn btn-outline" href="#book" whileTap={{ scale: 0.97 }}>{t('cta.book')}</m.a>
        </m.div>
        <m.p className="price" {...item(3)}>{t('price.line')}</m.p>
      </div>
      <m.div className="phone" aria-hidden="true" initial={{ opacity: 0, y: 40, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
        <m.div className="phone-cover" style={SAMPLE ? themeStyle(SAMPLE.theme) : undefined} animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          {SAMPLE && <CoverThumb demo={SAMPLE} lang={lang} />}
          <span className="phone-sample">{t('hero.sample')}</span>
          <span className="phone-pill">{t('inv.open')}</span>
        </m.div>
      </m.div>
    </section>
  );
}

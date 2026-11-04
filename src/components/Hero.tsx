import { m } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { WhatsAppLink } from './WhatsAppLink';

const item = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.05 + i * 0.08, ease: 'easeOut' as const }
});

/* Compact intro: the sample cards right below are the product shot. */
export function Hero() {
  const { t } = useI18n();
  return (
    <section className="hero wrap">
      <m.h1 {...item(0)}>{t('hero.title')}</m.h1>
      <m.div className="cta-row" {...item(1)}>
        <WhatsAppLink className="btn btn-wa">{t('cta.wa')}</WhatsAppLink>
        <m.a className="btn btn-outline" href="#book" whileTap={{ scale: 0.97 }}>{t('cta.book')}</m.a>
      </m.div>
    </section>
  );
}

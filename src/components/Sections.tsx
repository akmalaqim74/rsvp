import { m } from 'motion/react';
import { reveal } from '../motion';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import { EVENT_TYPES } from '../types';

export function How() {
  const { t } = useI18n();
  return (
    <section className="band wrap" id="how">
      <m.h2 {...reveal()}>{t('how.title')}</m.h2>
      <ol className="cards">
        {[1, 2, 3].map((n) => (
          <m.li key={n} {...reveal(n * 0.08)}>
            <span className="num">{n}</span>
            <h3>{t(`how.${n}t`)}</h3>
            <p>{t(`how.${n}d`)}</p>
          </m.li>
        ))}
      </ol>
    </section>
  );
}

export function Events() {
  const { t } = useI18n();
  const cfg = useSiteConfig();
  return (
    <section className="band wrap" id="events">
      <m.h2 {...reveal()}>{t('events.title')}</m.h2>
      <div className="cards cards-4">
        {EVENT_TYPES.filter((ty) => cfg.show[ty]).map((ty, i) => (
          <m.article key={ty} {...reveal(i * 0.08)}>
            <h3>{t(`event.${ty}.t`)}</h3>
            <p>{t(`event.${ty}.d`)}</p>
          </m.article>
        ))}
      </div>
    </section>
  );
}

export function Demo() {
  const { t } = useI18n();
  const cfg = useSiteConfig();
  if (!cfg.demo_url) return null;
  return (
    <m.section className="band wrap demo" id="demo" {...reveal()}>
      <h2>{t('demo.title')}</h2>
      <p>{t('demo.note')}</p>
      <a className="btn btn-primary" href={cfg.demo_url} target="_blank" rel="noopener noreferrer">{t('demo.cta')}</a>
    </m.section>
  );
}

export function Get() {
  const { t } = useI18n();
  return (
    <section className="band wrap" id="get">
      <m.h2 {...reveal()}>{t('get.title')}</m.h2>
      <ul className="ticks">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <m.li key={n} {...reveal(n * 0.05)}>{t(`get.${n}`)}</m.li>
        ))}
      </ul>
    </section>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <section className="band wrap" id="faq">
      <m.h2 {...reveal()}>{t('faq.title')}</m.h2>
      {[1, 2, 3, 4, 5].map((n) => (
        <m.details key={n} {...reveal(n * 0.05)}>
          <summary>{t(`faq.q${n}`)}</summary>
          <p>{t(`faq.a${n}`)}</p>
        </m.details>
      ))}
    </section>
  );
}

import { m } from 'motion/react';
import { reveal } from '../motion';
import { useI18n } from '../lib/i18n';

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

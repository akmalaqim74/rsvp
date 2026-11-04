import { useState, type KeyboardEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { reveal } from '../motion';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import { EVENT_TYPES, type EventType } from '../types';

/* All sample content below is labelled "Sample" on screen. The preview is plain CSS, no images. */
function Preview({ type }: { type: EventType }) {
  const { t } = useI18n();
  const quiet = type === 'funeral';
  return (
    <div className={`phone${quiet ? ' quiet' : ''}`} aria-hidden="true">
      <div className="phone-in">
        <span className="sample">{t('hero.sample')}</span>
        <p className="m-small">{t(`demo.${type}.line`)}</p>
        <p className="m-title">{t(`demo.${type}.title`)}</p>
        <p className="m-meta">{t(`demo.${type}.meta`)}</p>
        <p className="m-chip">{t('demo.chip')}</p>
        <div className="m-btns">
          <span>{t(quiet ? 'demo.attend' : 'mock.yes')}</span>
          <span className="alt">{t(quiet ? 'demo.decline' : 'mock.no')}</span>
          <span className="alt map">{t('demo.map')}</span>
        </div>
      </div>
    </div>
  );
}

export function Demos() {
  const { t } = useI18n();
  const cfg = useSiteConfig();
  const types = EVENT_TYPES.filter((ty) => cfg.show[ty]);
  const [picked, setPicked] = useState<EventType>('wedding');
  const active = types.includes(picked) ? picked : types[0];
  if (!active) return null;
  const url = cfg.demo[active];

  function onKeyDown(e: KeyboardEvent) {
    const i = types.indexOf(active);
    const next = e.key === 'ArrowRight' ? types[(i + 1) % types.length]
      : e.key === 'ArrowLeft' ? types[(i - 1 + types.length) % types.length] : null;
    if (!next) return;
    e.preventDefault();
    setPicked(next);
    requestAnimationFrame(() => document.getElementById(`tab-${next}`)?.focus());
  }

  return (
    <section className="band wrap" id="demos">
      <m.div {...reveal()}>
        <h2>{t('demo.title')}</h2>
        <p className="lead">{t('demo.sub')}</p>
      </m.div>
      <m.div {...reveal(0.1)}>
        <div className="tabs" role="tablist" aria-label={t('demo.title')} onKeyDown={onKeyDown}>
          {types.map((ty) => (
            <button key={ty} id={`tab-${ty}`} role="tab" type="button" aria-selected={ty === active}
              aria-controls="demo-panel" tabIndex={ty === active ? 0 : -1} onClick={() => setPicked(ty)}>
              {t(`event.${ty}.t`)}
            </button>
          ))}
        </div>
        <div className="stage" id="demo-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
          <AnimatePresence mode="wait">
            <m.div key={active} className="stage-in" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Preview type={active} />
              <div className="stage-text">
                <h3>{t(`event.${active}.t`)}</h3>
                <p>{t(`event.${active}.d`)}</p>
                {url
                  ? <a className="btn btn-primary" href={url} target="_blank" rel="noopener noreferrer">{t('demo.open')}</a>
                  : <p className="small">{t('demo.soon')}</p>}
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </m.div>
    </section>
  );
}

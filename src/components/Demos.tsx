import { lazy, Suspense, useCallback, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { reveal } from '../motion';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import type { DemoInvite } from '../demos/data';
import { demosFor } from '../demos/registry';
import { CoverThumb } from './card/parts';
import { EVENT_TYPES, type EventType } from '../types';
import '../invitation.css';

/* The modal (and the iframe inside it) is only fetched when someone taps a design. */
const DemoModal = lazy(() => import('./DemoModal').then((mod) => ({ default: mod.DemoModal })));

const FIRST = 8; // designs shown per category before "Show all"

export function Demos() {
  const { t, lang } = useI18n();
  const cfg = useSiteConfig();
  const types = EVENT_TYPES.filter((ty) => cfg.show[ty]);
  const [picked, setPicked] = useState<EventType>('wedding');
  const [open, setOpen] = useState<DemoInvite | null>(null);
  const [showAll, setShowAll] = useState<EventType | null>(null); // category whose full list is expanded
  const close = useCallback(() => setOpen(null), []);
  const active = types.includes(picked) ? picked : types[0];
  if (!active) return null;
  const designs = demosFor(active);
  const shown = showAll === active ? designs : designs.slice(0, FIRST);

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
              {t(`event.${ty}.t`)} <span className="tab-n">{demosFor(ty).length}</span>
            </button>
          ))}
        </div>
        <div className="stage" id="demo-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
          <AnimatePresence mode="wait">
            <m.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="stage-d">{t(`event.${active}.d`)}</p>
              <ul className="gal">
                {shown.map((d) => (
                  <li key={d.id}>
                    <button type="button" className="tile" aria-haspopup="dialog" onClick={() => setOpen(d)}
                      aria-label={`${t('demo.preview')}: ${d.name[lang]}`}>
                      <CoverThumb demo={d} lang={lang} />
                      <span className="tile-cap" aria-hidden="true">{d.name[lang]}<small>{t('demo.tap')}</small></span>
                    </button>
                  </li>
                ))}
              </ul>
              {designs.length > shown.length && (
                <button type="button" className="btn btn-outline more" onClick={() => setShowAll(active)}>{t('demo.more')} ({designs.length})</button>
              )}
              <p className="small">{t('demo.note')}</p>
            </m.div>
          </AnimatePresence>
        </div>
      </m.div>
      {open && <Suspense fallback={null}><DemoModal demo={open} onClose={close} /></Suspense>}
    </section>
  );
}

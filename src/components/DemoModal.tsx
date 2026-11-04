import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { m } from 'motion/react';
import { demoPath, type DemoInvite } from '../demos/data';
import { useI18n } from '../lib/i18n';

const FOCUSABLE = 'a[href],button:not([disabled]),iframe';

/* Live sample in a same-origin iframe. The page inside runs with ?embed=1 (no site chrome).
   Esc inside the iframe reaches us as a postMessage; focus is trapped and restored on close. */
export function DemoModal({ demo, onClose }: { demo: DemoInvite; onClose: () => void }) {
  const { t, lang } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const to = encodeURIComponent(demo.guest);
  const title = `${demo.name[lang]}`;

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.getElementById('root');
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    root?.setAttribute('inert', '');
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !box.current) return;
      const items = Array.from(box.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const onMessage = (e: MessageEvent<unknown>) => {
      const d = e.data;
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      if (typeof d !== 'object' || d === null || !('type' in d)) return;
      if (d.type === 'rsvp-demo-close') onClose();
      if (d.type === 'rsvp-demo-ready') setLoaded(true);
    };
    const failsafe = window.setTimeout(() => setLoaded(true), 8000);
    document.addEventListener('keydown', onKey);
    window.addEventListener('message', onMessage);
    return () => {
      window.clearTimeout(failsafe);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('message', onMessage);
      document.documentElement.style.overflow = prevOverflow;
      root?.removeAttribute('inert');
      opener?.focus();
    };
  }, [onClose]);

  return createPortal(
    <m.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" ref={box} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <strong id="modal-title">{title}</strong>
          <div>
            <a href={`${demoPath(demo)}?to=${to}`} target="_blank" rel="noopener noreferrer">{t('demo.full')}</a>
            <button ref={closeBtn} type="button" aria-label={t('demo.close')} onClick={onClose}>×</button>
          </div>
        </div>
        <div className="modal-frame">
          {!loaded && <p className="modal-load">{t('demo.loading')}</p>}
          <iframe ref={frame} title={`${t('demo.preview')}: ${title}`} src={`${demoPath(demo)}?embed=1&to=${to}`} style={{ visibility: loaded ? 'visible' : 'hidden' }} />
        </div>
        <div className="modal-foot">
          <p>{t('inv.banner')}</p>
          <Link className="btn btn-primary" to={{ pathname: '/', hash: 'book' }} onClick={onClose}>{t('inv.cta')}</Link>
        </div>
      </div>
    </m.div>,
    document.body
  );
}

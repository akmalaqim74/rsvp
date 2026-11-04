import { useEffect, useRef, useState, type FormEvent } from 'react';
import { m } from 'motion/react';
import type { DemoInvite } from '../../demos/data';
import { useI18n } from '../../lib/i18n';
import { WhatsAppLink } from '../WhatsAppLink';
import { fmtDate } from './parts';

/* ---- Our story: a simple timeline ---------------------------------------------------------- */
export function Story({ demo }: { demo: DemoInvite }) {
  const { lang } = useI18n();
  return (
    <ol className="iv-story">
      {demo.story?.map((s) => (
        <li key={s.when.en + s.title.en}>
          <span className="iv-story-when">{s.when[lang]}</span>
          <h3>{s.title[lang]}</h3>
          <p>{s.text[lang]}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---- Programme (aturcara) ------------------------------------------------------------------- */
export function Programme({ demo }: { demo: DemoInvite }) {
  const { lang } = useI18n();
  return (
    <ul className="iv-prog">
      {demo.programme?.map((p) => (
        <li key={p.time + p.label.en}>
          <time>{fmtDate(`2000-01-01T${p.time}:00+08:00`, lang, { hour: 'numeric', minute: '2-digit' })}</time>
          <span>{p.label[lang]}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---- Photo gallery: swipeable strip + lightbox. Placeholders only; real photos come from the host. */
function Lightbox({ count, start, onClose }: { count: number; start: number; onClose: () => void }) {
  const { t } = useI18n();
  const [i, setI] = useState(start);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); return; }
      if (e.key === 'ArrowRight') setI((n) => (n + 1) % count);
      if (e.key === 'ArrowLeft') setI((n) => (n - 1 + count) % count);
      if (e.key === 'Tab' && box.current) {
        const items = Array.from(box.current.querySelectorAll<HTMLElement>('button'));
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); opener?.focus(); };
  }, [count, onClose]);

  return (
    <div className="iv-lb" role="dialog" aria-modal="true" aria-label={t('inv.gallery')} ref={box}>
      <div className="iv-lb-top">
        <span>{t('inv.photo.n')} {i + 1} {t('inv.of')} {count}</span>
        <button ref={closeBtn} type="button" aria-label={t('demo.close')} onClick={onClose}>×</button>
      </div>
      <div className="iv-lb-stage">
        <button type="button" aria-label={t('inv.prev')} onClick={() => setI((n) => (n - 1 + count) % count)}>‹</button>
        <div className="iv-ph iv-ph-big" role="img" aria-label={`${t('inv.photo')} ${i + 1}`}><span>{t('inv.photo')}</span><small>{i + 1}</small></div>
        <button type="button" aria-label={t('inv.next')} onClick={() => setI((n) => (n + 1) % count)}>›</button>
      </div>
    </div>
  );
}

export function Gallery({ count }: { count: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <p className="iv-note">{t('inv.gallery.hint')}</p>
      <ul className="iv-gal" tabIndex={0} aria-label={t('inv.gallery')}>
        {Array.from({ length: count }, (_, n) => (
          <li key={n}>
            <button type="button" className="iv-ph" aria-label={`${t('inv.photo.n')} ${n + 1} ${t('inv.of')} ${count}`} onClick={() => setOpen(n)}>
              <span>{t('inv.photo')}</span><small>{n + 1}</small>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox count={count} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}

/* ---- Digital gift: sample QR card and copy-account ----------------------------------------- */
export function Gift({ demo }: { demo: DemoInvite }) {
  const { t, lang } = useI18n();
  const g = demo.gift;
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  if (!g) return null;
  async function copy() {
    try { await navigator.clipboard.writeText(g?.account.replace(/\s/g, '') ?? ''); } catch { /* shown only on success */ return; }
    setDone(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 2400);
  }
  return (
    <>
      <p className="iv-note">{t('inv.gift.d')}</p>
      <div className="iv-gift">
        <div className="iv-qr" role="img" aria-label={t('inv.gift.qr')}>
          <i /><i /><i />
          <span>{t('inv.gift.qr')}</span>
        </div>
        <p className="iv-venue">{g.bank[lang]}</p>
        <p className="iv-addr">{t('inv.gift.holder')}: {g.holder}</p>
        <p className="iv-acct">{g.account}</p>
        <button className="iv-btn iv-btn-ghost" type="button" onClick={copy}>{t('inv.gift.copy')}</button>
        <p className="iv-copied" role="status">{done ? t('inv.gift.copied') : ''}</p>
      </div>
      <p className="iv-sim">{t('inv.gift.sample')}</p>
    </>
  );
}

/* ---- Guestbook: simulated, nothing is saved ------------------------------------------------- */
interface Wish { from: string; text: string }
export function Wishes({ demo, guest }: { demo: DemoInvite; guest: string }) {
  const { t, lang } = useI18n();
  const [extra, setExtra] = useState<Wish[]>([]);
  const [name, setName] = useState(guest);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState<{ name?: boolean; msg?: boolean }>({});
  const seeded: Wish[] = (demo.wishes ?? []).map((w) => ({ from: w.from, text: w.text[lang] }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const bad = { name: !name.trim(), msg: !msg.trim() };
    setErr(bad);
    if (bad.name || bad.msg) return;
    setExtra((x) => [{ from: name.trim(), text: msg.trim() }, ...x]);
    setMsg('');
  }
  return (
    <>
      <ul className="iv-wishes" aria-live="polite">
        {[...extra, ...seeded].map((w, i) => (
          <m.li key={`${w.from}-${i}-${w.text.slice(0, 8)}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p>{w.text}</p><span>{w.from}</span>
          </m.li>
        ))}
      </ul>
      <form className="iv-form" onSubmit={submit} noValidate>
        <div className={`iv-field${err.name ? ' bad' : ''}`}>
          <label htmlFor="wish-name">{t('form.name')}</label>
          <input id="wish-name" autoComplete="off" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
          <span className="iv-err" role="alert">{err.name ? t('err.name') : ''}</span>
        </div>
        <div className={`iv-field${err.msg ? ' bad' : ''}`}>
          <label htmlFor="wish-msg">{t('inv.wish.msg')}</label>
          <textarea id="wish-msg" maxLength={240} rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} />
          <span className="iv-err" role="alert">{err.msg ? t('err.msg') : ''}</span>
        </div>
        <button className="iv-btn iv-btn-solid iv-block" type="submit">{t('inv.wish.send')}</button>
      </form>
      <p className="iv-sim">{t('inv.wish.sample')}</p>
    </>
  );
}

/* ---- Contact persons: every button uses the Sheet Config number (sample) -------------------- */
export function Contacts({ demo }: { demo: DemoInvite }) {
  const { t, lang } = useI18n();
  return (
    <>
      <ul className="iv-contacts">
        {demo.contacts?.map((c) => (
          <li key={c.name}>
            <div><strong>{c.name}</strong><span>{c.role[lang]}</span></div>
            <WhatsAppLink className="iv-btn iv-btn-solid">{t('inv.wa')}</WhatsAppLink>
          </li>
        ))}
      </ul>
      <p className="iv-sim">{t('inv.contact.sample')}</p>
    </>
  );
}

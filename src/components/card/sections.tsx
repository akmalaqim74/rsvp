import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { m } from 'motion/react';
import { mapsUrl, wazeUrl, type DemoEvent, type DemoInvite } from '../../demos/data';
import { useI18n } from '../../lib/i18n';
import { WhatsAppLink } from '../WhatsAppLink';
import { reveal } from '../../motion';
import { fmtDate } from './parts';

/* ---- Countdown ----------------------------------------------------------------------------- */
function useCountdown(iso: string) {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, target - now);
  return { past: target <= now, d: Math.floor(ms / 86400000), h: Math.floor(ms / 3600000) % 24, mi: Math.floor(ms / 60000) % 60, s: Math.floor(ms / 1000) % 60 };
}

export function Countdown({ iso }: { iso: string }) {
  const { t } = useI18n();
  const c = useCountdown(iso);
  if (c.past) return <p className="iv-past">{t('inv.past')}</p>;
  const cells: [number, string][] = [[c.d, 'inv.days'], [c.h, 'inv.hours'], [c.mi, 'inv.minutes'], [c.s, 'inv.seconds']];
  return (
    <div className="iv-count" role="timer" aria-label={t('inv.countdown')}>
      {cells.map(([n, key]) => (
        <div key={key}><strong>{String(n).padStart(2, '0')}</strong><span>{t(key)}</span></div>
      ))}
    </div>
  );
}

/* ---- Calendar file (works on iPhone and Android, no account needed) ------------------------- */
const icsDate = (d: Date): string => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s: string): string => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

function downloadIcs(demo: DemoInvite, e: DemoEvent, lang: 'ms' | 'en') {
  const start = new Date(e.start);
  const end = new Date(start.getTime() + e.hours * 3600000);
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//RSVP sample//EN', 'BEGIN:VEVENT',
    `UID:${start.getTime()}-${demo.category}-${demo.id}@sample.invalid`,
    `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(`${demo.names.join(demo.joiner ? ` ${demo.joiner} ` : ' ')} (${e.label[lang]})`)}`,
    `LOCATION:${icsText(`${e.venue[lang]}, ${e.address}`)}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'event.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* blocked */ }
    ta.remove();
    return ok;
  }
}

/* ---- One event: date, venue, map buttons ---------------------------------------------------- */
export function EventBlock({ demo, e }: { demo: DemoInvite; e: DemoEvent }) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopy() {
    setCopied((await copyText(`${e.venue[lang]}, ${e.address}`)) ? 'ok' : 'fail');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 2600);
  }
  const end = new Date(new Date(e.start).getTime() + e.hours * 3600000).toISOString();
  const time = `${fmtDate(e.start, lang, { hour: 'numeric', minute: '2-digit' })} – ${fmtDate(end, lang, { hour: 'numeric', minute: '2-digit' })}`;

  return (
    <article className="iv-event">
      <h3 className="iv-label">{e.label[lang]}</h3>
      <p className="iv-when">{fmtDate(e.start, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p className="iv-time">{time}</p>
      <p className="iv-venue">{e.venue[lang]}</p>
      <p className="iv-addr">{e.address}</p>
      <div className="iv-acts">
        <a className="iv-btn iv-btn-ghost" href={mapsUrl(e, lang)} target="_blank" rel="noopener noreferrer">{t('inv.maps')}</a>
        <a className="iv-btn iv-btn-ghost" href={wazeUrl(e, lang)} target="_blank" rel="noopener noreferrer">{t('inv.waze')}</a>
        <button className="iv-btn iv-btn-ghost" type="button" onClick={onCopy}>{t('inv.copy')}</button>
        <button className="iv-btn iv-btn-ghost" type="button" onClick={() => downloadIcs(demo, e, lang)}>{t('inv.cal')}</button>
      </div>
      <p className="iv-copied" role="status">{copied === 'ok' ? t('inv.copied') : copied === 'fail' ? t('inv.copyfail') : ''}</p>
    </article>
  );
}

/* ---- RSVP (simulated: nothing is sent anywhere) --------------------------------------------- */
function Stepper({ id, label, value, min, max, onChange }: { id: string; label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const { t } = useI18n();
  return (
    <div className="iv-step" role="group" aria-labelledby={`${id}-l`}>
      <span id={`${id}-l`}>{label}</span>
      <div>
        <button type="button" aria-label={`${t('inv.fewer')}: ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
        <output aria-live="polite" id={id}>{value}</output>
        <button type="button" aria-label={`${t('inv.more')}: ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

export function Rsvp({ demo, guest }: { demo: DemoInvite; guest: string }) {
  const { t } = useI18n();
  const quiet = demo.quiet;
  const [name, setName] = useState(guest);
  const [attending, setAttending] = useState<'yes' | 'no' | ''>('');
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [errors, setErrors] = useState<{ name?: boolean; attending?: boolean }>({});
  const [done, setDone] = useState<null | { yes: boolean; adults: number; kids: number }>(null);

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const errs = { name: !name.trim(), attending: !attending };
    setErrors(errs);
    if (errs.name || errs.attending) return;
    setDone({ yes: attending === 'yes', adults, kids });
  }

  if (done) {
    return (
      <m.div className="iv-done" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="iv-done-t">{t(done.yes ? (quiet ? 'inv.thanks.yes.quiet' : 'inv.thanks.yes') : 'inv.thanks.no')}</p>
        {done.yes && <p className="iv-addr">{quiet ? `${t('inv.people')}: ${done.adults}` : `${t('inv.adults')}: ${done.adults} · ${t('inv.children')}: ${done.kids}`}</p>}
        <p className="iv-sim">{t('inv.thanks')}</p>
        <button className="iv-btn iv-btn-ghost" type="button" onClick={() => setDone(null)}>{t('inv.again')}</button>
      </m.div>
    );
  }

  const opts = (['yes', 'no'] as const).map((v) => ({ v, label: t(`inv.${v}${quiet ? '.quiet' : ''}`) }));
  return (
    <form onSubmit={onSubmit} noValidate className="iv-form">
      <div className={`iv-field${errors.name ? ' bad' : ''}`}>
        <label htmlFor="iv-name">{t('form.name')}</label>
        <input id="iv-name" autoComplete="off" maxLength={80} value={name} onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? true : undefined} aria-describedby="iv-name-e" />
        <span className="iv-err" id="iv-name-e" role="alert">{errors.name ? t('err.name') : ''}</span>
      </div>
      <fieldset className={`iv-choice${errors.attending ? ' bad' : ''}`}>
        <legend className="sr-only">{t(quiet ? 'inv.rsvp.quiet' : 'inv.rsvp')}</legend>
        {opts.map(({ v, label }) => (
          <label key={v} className={attending === v ? 'on' : undefined}>
            <input type="radio" name="iv-att" value={v} checked={attending === v} onChange={() => setAttending(v)} />
            <span>{label}</span>
          </label>
        ))}
        <span className="iv-err" role="alert">{errors.attending ? t('inv.pick') : ''}</span>
      </fieldset>
      {attending === 'yes' && (
        <div className="iv-steps">
          <Stepper id="iv-ad" label={quiet ? t('inv.people') : t('inv.adults')} value={adults} min={1} max={10} onChange={setAdults} />
          {!quiet && <Stepper id="iv-ch" label={t('inv.children')} value={kids} min={0} max={10} onChange={setKids} />}
        </div>
      )}
      <button className="iv-btn iv-btn-solid iv-block" type="submit">{t('inv.send')}</button>
    </form>
  );
}

/* ---- Paper section wrapper with gentle reveal ---------------------------------------------- */
export function Section({ title, children, alt, id, hero }: { title?: string; children: ReactNode; alt?: boolean; id?: string; hero?: boolean }) {
  return (
    <m.section className={`iv-sec${alt ? ' alt' : ''}${hero ? ' iv-hero' : ''}`} id={id} {...reveal()} aria-label={title}>
      {title && <h2 className="iv-h">{title}</h2>}
      {children}
    </m.section>
  );
}

export function Contact() {
  const { t } = useI18n();
  return (
    <>
      <p className="iv-note">{t('inv.contact.d')}</p>
      <WhatsAppLink className="iv-btn iv-btn-solid">{t('inv.contact.btn')}</WhatsAppLink>
      <p className="iv-sim">{t('inv.contact.sample')}</p>
    </>
  );
}

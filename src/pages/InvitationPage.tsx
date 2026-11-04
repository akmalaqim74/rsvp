import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, m } from 'motion/react';
import { findDemo, type DemoInvite } from '../demos/data';
import { useI18n } from '../lib/i18n';
import { WhatsAppLink } from '../components/WhatsAppLink';
import { LANGS } from '../types';

const TZ = 'Asia/Kuala_Lumpur';

function useCountdown(iso: string) {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, target - now);
  return { past: target <= now, days: Math.floor(ms / 86400000), hours: Math.floor(ms / 3600000) % 24, minutes: Math.floor(ms / 60000) % 60 };
}

function Countdown({ iso }: { iso: string }) {
  const { t } = useI18n();
  const c = useCountdown(iso);
  if (c.past) return <p className="inv-past">{t('inv.past')}</p>;
  const cells: [number, string][] = [[c.days, 'inv.days'], [c.hours, 'inv.hours'], [c.minutes, 'inv.minutes']];
  return (
    <div className="count" role="timer" aria-label={t('inv.countdown')}>
      {cells.map(([n, key]) => (
        <div key={key}><strong>{n}</strong><span>{t(key)}</span></div>
      ))}
    </div>
  );
}

/* The demo reply is simulated: nothing is sent anywhere. */
function ReplyForm({ quiet }: { quiet: boolean }) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no' | ''>('');
  const [pax, setPax] = useState('1');
  const [errors, setErrors] = useState<{ name?: boolean; attending?: boolean }>({});
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = { name: !name.trim(), attending: !attending };
    setErrors(errs);
    if (errs.name || errs.attending) return;
    setDone(true);
  }

  if (done) return <m.p className="status ok" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{t('inv.thanks')}</m.p>;

  return (
    <form onSubmit={onSubmit} noValidate className="inv-form">
      <div className={`field${errors.name ? ' bad' : ''}`}>
        <label htmlFor="r-name">{t('form.name')}</label>
        <input id="r-name" autoComplete="off" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
        <span className="err" role="alert">{errors.name ? t('err.name') : ''}</span>
      </div>
      <fieldset className={`choice${errors.attending ? ' bad' : ''}`}>
        <legend className="sr-only">{t(quiet ? 'inv.rsvp.quiet' : 'inv.rsvp')}</legend>
        {(['yes', 'no'] as const).map((v) => (
          <button key={v} type="button" aria-pressed={attending === v} onClick={() => setAttending(v)}>
            {t(quiet ? (v === 'yes' ? 'demo.attend' : 'demo.decline') : (v === 'yes' ? 'mock.yes' : 'mock.no'))}
          </button>
        ))}
        <span className="err" role="alert">{errors.attending ? t('inv.pick') : ''}</span>
      </fieldset>
      {attending === 'yes' && !quiet && (
        <div className="field">
          <label htmlFor="r-pax">{t('inv.pax')}</label>
          <select id="r-pax" value={pax} onChange={(e) => setPax(e.target.value)}>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      )}
      <button className="btn btn-primary btn-block" type="submit">{t('inv.send')}</button>
    </form>
  );
}

function Invitation({ demo }: { demo: DemoInvite }) {
  const { t, lang, setLang } = useI18n();
  const [opened, setOpened] = useState(false);
  const quiet = demo.category === 'funeral';
  const when = new Intl.DateTimeFormat(lang === 'ms' ? 'ms-MY' : 'en-MY', { dateStyle: 'full', timeStyle: 'short', timeZone: TZ }).format(new Date(demo.date));

  return (
    <div className="inv" data-cat={demo.category}>
      <div className="inv-top">
        <Link to={{ pathname: '/', hash: 'demos' }}>← {t('inv.back')}</Link>
        <div className="lang" role="group" aria-label="Language">
          {LANGS.map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
        </div>
      </div>
      <p className="inv-banner">{t('inv.banner')}</p>

      <AnimatePresence mode="wait">
        {!opened ? (
          <m.section key="cover" className="inv-cover" exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            <p className="m-small">{t(`demo.${demo.category}.line`)}</p>
            <h1>{demo.title[lang]}</h1>
            <p className="inv-hosts">{demo.hosts[lang]}</p>
            <button className="btn btn-primary" type="button" onClick={() => setOpened(true)}>{t('inv.open')}</button>
          </m.section>
        ) : (
          <m.main key="body" className="inv-body" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1>{demo.title[lang]}</h1>
            <p className="inv-hosts">{demo.hosts[lang]}</p>
            <div className="inv-card">
              <h2>{t('inv.when')}</h2>
              <p>{when}</p>
              <h2>{t('inv.where')}</h2>
              <p>{demo.venue[lang]}</p>
              <a className="btn btn-outline" href={demo.mapsUrl} target="_blank" rel="noopener noreferrer">{t('demo.map')}</a>
            </div>
            {demo.countdown && <Countdown iso={demo.date} />}
            <div className="inv-card">
              <h2>{t(quiet ? 'inv.rsvp.quiet' : 'inv.rsvp')}</h2>
              <ReplyForm quiet={quiet} />
            </div>
          </m.main>
        )}
      </AnimatePresence>

      <div className="inv-cta">
        <Link className="btn btn-primary" to={{ pathname: '/', hash: 'book' }}>{t('inv.cta')}</Link>
        <WhatsAppLink className="btn btn-wa">{t('cta.wa')}</WhatsAppLink>
      </div>
    </div>
  );
}

export function InvitationPage() {
  const { category = '', id = '' } = useParams();
  const { t } = useI18n();
  const demo = findDemo(category, id);
  if (!demo) {
    return (
      <div className="inv" data-cat="other">
        <p className="inv-banner">{t('inv.notfound')}</p>
        <div className="inv-cta"><Link className="btn btn-primary" to="/">{t('inv.home')}</Link></div>
      </div>
    );
  }
  return <Invitation demo={demo} />;
}

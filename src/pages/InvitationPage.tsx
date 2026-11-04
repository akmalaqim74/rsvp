import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import { findDemo, type DemoInvite } from '../demos/data';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import { waHref } from '../lib/config';
import { WhatsAppLink } from '../components/WhatsAppLink';
import { LANGS } from '../types';
import { CoverText, Divider, Frame, LoopClip, isLong, themeStyle } from '../components/card/parts';
import { Contact, Countdown, EventBlock, Rsvp, Section } from '../components/card/sections';
import '../invitation.css';

/* Guest name comes from the link (?to=Name). It is text only, trimmed and capped. */
const cleanGuest = (v: string | null): string => (v ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60);

type Phase = 'closed' | 'opening' | 'open';

function Cover({ demo, guest, phase, embed, onOpen, onDone }: { demo: DemoInvite; guest: string; phase: Phase; embed: boolean; onOpen: () => void; onDone: () => void }) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const btn = useRef<HTMLButtonElement>(null);
  const opening = phase === 'opening';

  /* In the modal the close button keeps focus, so the dialog stays predictable. */
  useEffect(() => { if (!embed) btn.current?.focus({ preventScroll: true }); }, [embed]);
  useEffect(() => {
    if (!opening) return;
    const id = window.setTimeout(onDone, reduce ? 450 : 1500); // safety net if the animation callback never fires
    return () => window.clearTimeout(id);
  }, [opening, reduce, onDone]);

  const door = (side: 'l' | 'r') => (
    <m.div key={side} className={`door door-${side}`} aria-hidden="true"
      animate={{ x: opening && !reduce ? (side === 'l' ? '-102%' : '102%') : '0%' }}
      transition={{ duration: 1, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => { if (opening && side === 'l') onDone(); }}>
      <div className="door-in"><Frame category={demo.category} /></div>
    </m.div>
  );

  return (
    <m.div className="cover cv-page" style={themeStyle(demo.theme)} role="region" aria-label={demo.kicker[lang]}
      animate={{ opacity: opening && reduce ? 0 : 1 }} transition={{ duration: 0.4 }}>
      <LoopClip category={demo.category} />
      {door('l')}
      {door('r')}
      <m.div className="cv cv-face" animate={opening ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
        <CoverText demo={demo} lang={lang} heading>
          {guest && (
            <p className="cv-guest"><span>{t('inv.invited')}</span><strong>{guest}</strong></p>
          )}
          <button ref={btn} className="cv-open" type="button" onClick={onOpen} disabled={opening}>{t('inv.open')}</button>
        </CoverText>
      </m.div>
    </m.div>
  );
}

function Body({ demo, guest, hidden }: { demo: DemoInvite; guest: string; hidden: boolean }) {
  const { t, lang } = useI18n();
  const cfg = useSiteConfig();
  const hasWa = Boolean(waHref(cfg, lang));
  const first = demo.events[0];
  return (
    <main className="iv-card" inert={hidden} aria-hidden={hidden || undefined} id="iv-main" tabIndex={-1}>
      <Section hero>
        <div className="paper-fr"><Frame category={demo.category} /></div>
        <p className="iv-kicker">{demo.kicker[lang]}</p>
        <p className={`iv-names${isLong(demo) ? ' long' : ''}`} aria-label={demo.names.join(demo.joiner ? ` ${demo.joiner} ` : ' ')}>
          {demo.names.map((n, i) => (
            <span key={n} aria-hidden="true">{i > 0 && demo.joiner && <i>{demo.joiner}</i>}{n}</span>
          ))}
        </p>
        {demo.subtitle && <p className="iv-sub">{demo.subtitle[lang]}</p>}
        <Divider category={demo.category} />
        <p className="iv-lead">{demo.invite[lang]}</p>
        <div className="iv-hosts">{demo.hosts[lang].map((h) => <p key={h}>{h}</p>)}</div>
      </Section>

      <Section title={t(demo.events.length > 1 ? 'inv.events' : 'inv.event')} alt>
        {demo.events.map((e) => <EventBlock key={e.start + e.label.en} demo={demo} e={e} />)}
        {demo.countdown && !demo.quiet && <Countdown iso={first.start} />}
      </Section>

      <Section title={t('inv.note')}>
        <p className="iv-lead">{demo.note[lang]}</p>
      </Section>

      <Section title={t(demo.quiet ? 'inv.rsvp.quiet' : 'inv.rsvp')} alt id="rsvp">
        <p className="iv-note">{t(demo.quiet ? 'inv.rsvp.sub.quiet' : 'inv.rsvp.sub')}</p>
        <Rsvp demo={demo} guest={guest} />
      </Section>

      {hasWa && (
        <Section title={t('inv.contact')}>
          <Contact />
        </Section>
      )}

      <Section alt>
        <Divider category={demo.category} />
        <p className="iv-closing">{demo.closing[lang]}</p>
        <p className="iv-sign">{demo.names.join(demo.joiner ? ` ${demo.joiner} ` : ' · ')}</p>
      </Section>
    </main>
  );
}

function Invitation({ demo }: { demo: DemoInvite }) {
  const { t, lang, setLang } = useI18n();
  const [params] = useSearchParams();
  const embed = params.get('embed') === '1';
  const guest = cleanGuest(params.get('to'));
  const [phase, setPhase] = useState<Phase>('closed');
  const closed = phase === 'closed';

  /* Lock page scroll while the cover is shut, then start at the top. */
  useEffect(() => {
    if (phase === 'open') return;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    return () => { root.style.overflow = ''; };
  }, [phase]);

  /* In the modal, Esc is pressed inside the iframe: tell the page that holds it. */
  useEffect(() => {
    if (!embed) return;
    window.parent.postMessage({ type: 'rsvp-demo-ready' }, window.location.origin);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') window.parent.postMessage({ type: 'rsvp-demo-close' }, window.location.origin); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [embed]);

  function onOpen() {
    window.scrollTo(0, 0);
    setPhase('opening');
  }
  const onDone = useCallback(() => setPhase((p) => (p === 'opening' ? 'open' : p)), []);
  useEffect(() => {
    if (phase === 'open') document.getElementById('iv-main')?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div className="iv" data-cat={demo.category} data-embed={embed || undefined} style={themeStyle(demo.theme)} lang={lang}>
      {!embed && (
        <div className="iv-top">
          <Link to={{ pathname: '/', hash: 'demos' }}>← {t('inv.back')}</Link>
          <span className="iv-sample">{t('hero.sample')}</span>
          <div className="lang" role="group" aria-label="Language">
            {LANGS.map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
          </div>
        </div>
      )}
      {phase !== 'open' && <Cover demo={demo} guest={guest} phase={phase} embed={embed} onOpen={onOpen} onDone={onDone} />}
      <Body demo={demo} guest={guest} hidden={closed} />
      {!embed && (
        <div className="iv-bar">
          <p>{t('inv.banner')}</p>
          <div>
            <Link className="iv-btn iv-btn-solid" to={{ pathname: '/', hash: 'book' }}>{t('inv.cta')}</Link>
            <WhatsAppLink className="iv-btn iv-btn-wa">{t('cta.wa')}</WhatsAppLink>
          </div>
        </div>
      )}
    </div>
  );
}

export function InvitationPage() {
  const { category = '', id = '' } = useParams();
  const { t } = useI18n();
  const demo = findDemo(category, id);
  if (!demo) {
    return (
      <div className="iv iv-missing">
        <p>{t('inv.notfound')}</p>
        <Link className="iv-btn iv-btn-solid" to="/">{t('inv.home')}</Link>
      </div>
    );
  }
  return <Invitation demo={demo} />;
}

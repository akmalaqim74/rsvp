import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import { findDemo, type CoverKind, type DemoInvite } from '../demos/data';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import { waHref } from '../lib/config';
import { WhatsAppLink } from '../components/WhatsAppLink';
import { LANGS } from '../types';
import { CoverArt, CoverText, Divider, Frame, LoopClip, PortraitPanel, coverKind, isLong, themeStyle } from '../components/card/parts';
import { CatCtx, Countdown, EventBlock, Rsvp, Section } from '../components/card/sections';
import { Contacts, Gallery, useGallery, Gift, Programme, Story, Wishes } from '../components/card/extras';
import { BIGDATE, BIGNUM, BigDate, BigNum, CoupleHeader } from '../components/card/layout';
import { MusicButton, useMusic } from '../components/card/music';
import '../invitation.css';

/* Guest name comes from the link (?to=Name). It is text only, trimmed and capped. */
const cleanGuest = (v: string | null): string => (v ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60);

type Phase = 'closed' | 'opening' | 'open';
type Opening = 'fold' | 'gate' | 'book' | 'flap' | 'unfold' | 'bloom';
const OPENING: Record<CoverKind, Opening> = {
  classic: 'fold', portrait: 'fold', oval: 'fold', songket: 'gate', ticket: 'gate',
  arch: 'book', age: 'book', foil: 'flap', modern: 'unfold', balloons: 'unfold', wreath: 'bloom'
};

function Cover({ demo, guest, phase, embed, onOpen, onDone }: { demo: DemoInvite; guest: string; phase: Phase; embed: boolean; onOpen: () => void; onDone: () => void }) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const btn = useRef<HTMLButtonElement>(null);
  const opening = phase === 'opening';

  /* In the modal the close button keeps focus, so the dialog stays predictable. */
  useEffect(() => { if (!embed) btn.current?.focus({ preventScroll: true }); }, [embed]);
  useEffect(() => {
    if (!opening) return;
    const id = window.setTimeout(onDone, reduce ? 1300 : 3000); // safety net only: must outlast the longest swing (~1.7 s incl. delay) and the 1.1 s reduced dissolve
    return () => window.clearTimeout(id);
  }, [opening, reduce, onDone]);

  const kind = coverKind(demo);
  const type = OPENING[kind];
  const go = opening && !reduce;
  const shade = (d: number, dur: number) => (
    <m.span className="door-shade" animate={{ opacity: go ? 1 : 0 }} transition={{ duration: dur, delay: d, ease: 'easeIn' }} />
  );
  const art = () => <div className="door-in"><CoverArt demo={demo} /></div>;
  const photo = (side: 'groom' | 'bride') => kind === 'portrait' && <PortraitPanel side={side} priority />;
  const ease = [0.45, 0.05, 0.2, 1] as const;

  /* One opening per cover kind: two panels hinged on the outer edges (fold, gate, bloom), a page turning
     from the spine (book), an envelope flap lifting from the top (flap) or a card unfolding upward (unfold).
     Transform and opacity only. */
  const hinged = (side: 'l' | 'r', deg: number, dur: number, delay: number, extra: Record<string, number> = {}) => (
    <m.div key={side} className={`door door-${side}`} aria-hidden="true"
      animate={go ? { rotateY: side === 'l' ? -deg : deg, ...extra } : { rotateY: 0, scale: 1, opacity: 1 }}
      transition={{ duration: dur, delay, ease }}
      onAnimationComplete={() => { if (go && side === 'l') onDone(); }}>
      {photo(side === 'l' ? 'groom' : 'bride')}
      {art()}
      {shade(delay, dur * 0.8)}
    </m.div>
  );
  const panels = () => {
    switch (type) {
      case 'gate': return <>{hinged('l', 100, 1.3, 0.35)}{hinged('r', 100, 1.3, 0.35)}</>;
      case 'bloom': return <>{hinged('l', 68, 1.2, 0.3, { scale: 1.14, opacity: 0 })}{hinged('r', 68, 1.2, 0.3, { scale: 1.14, opacity: 0 })}</>;
      case 'book':
        return (
          <m.div className="door pn-full pn-book" aria-hidden="true" animate={{ rotateY: go ? -168 : 0 }} transition={{ duration: 1.4, delay: 0.3, ease }}
            onAnimationComplete={() => { if (go) onDone(); }}>
            {art()}{shade(0.3, 1.1)}
          </m.div>
        );
      case 'unfold':
        return (
          <m.div className="door pn-full pn-up" aria-hidden="true" animate={{ rotateX: go ? 104 : 0 }} transition={{ duration: 1.3, delay: 0.3, ease }}
            onAnimationComplete={() => { if (go) onDone(); }}>
            {art()}{shade(0.3, 1)}
          </m.div>
        );
      case 'flap':
        return (
          <>
            <m.div className="door pn-full pn-pocket" aria-hidden="true" animate={{ y: go ? '5%' : 0, opacity: go ? 0 : 1 }} transition={{ duration: 0.5, delay: 0.95, ease: 'easeIn' }}
              onAnimationComplete={() => { if (go) onDone(); }}>
              {art()}
            </m.div>
            <m.div className="door pn-flap" aria-hidden="true" animate={{ rotateX: go ? 172 : 0 }} transition={{ duration: 1, delay: 0.3, ease }}>
              {art()}{shade(0.3, 0.8)}
            </m.div>
          </>
        );
      default: return <>{hinged('l', 105, 1.1, 0.3)}{hinged('r', 105, 1.1, 0.3)}</>;
    }
  };

  return (
    <m.div className={`cover cv-page cv-k-${kind}`} style={themeStyle(demo.theme)} role="region" aria-label={demo.kicker[lang]}
      animate={opening && reduce ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 1.1 : 0.4, ease: 'easeInOut' }}
      onAnimationComplete={() => { if (opening && reduce) onDone(); }}>
      <LoopClip category={demo.category} />
      {panels()}
      <m.div className="cv cv-face" animate={opening ? { opacity: 0, scale: reduce ? 1 : 1.04 } : { opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0.5 : 0.35 }}>
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
  const quiet = demo.quiet;
  const kind = coverKind(demo);
  const photos = useGallery(demo.category, demo.gallery ?? 0);
  let alt = false;
  const flip = () => (alt = !alt); // alternate paper tone page by page
  return (
    <CatCtx.Provider value={demo.category}>
      <main className="iv-card" inert={hidden} aria-hidden={hidden || undefined} id="iv-main" tabIndex={-1}>
        <Section hero>
          {kind === 'portrait' && <CoupleHeader />}
          <div className="paper-fr"><Frame category={demo.category} /></div>
          <p className="iv-kicker">{demo.kicker[lang]}</p>
          <p className={`iv-names${isLong(demo) ? ' long' : ''}`} aria-label={demo.names.join(demo.joiner ? ` ${demo.joiner} ` : ' ')}>
            {demo.names.map((n, i) => (
              <span key={n} aria-hidden="true">{i > 0 && demo.joiner && <i>{demo.joiner}</i>}{n}</span>
            ))}
          </p>
          {demo.subtitle && <p className="iv-sub">{demo.subtitle[lang]}</p>}
          {BIGDATE.has(kind) && <BigDate iso={first.start} lang={lang} />}
          {BIGNUM.has(kind) && <BigNum demo={demo} />}
          <Divider category={demo.category} />
          <p className="iv-lead">{demo.invite[lang]}</p>
          <div className="iv-hosts">{demo.hosts[lang].map((h) => <p key={h}>{h}</p>)}</div>
          {kind === 'foil' && demo.countdown && !quiet && <Countdown iso={first.start} />}
          <p className="iv-scroll" aria-hidden="true"><span>{t('inv.scroll')}</span><i /></p>
        </Section>

        {demo.story && <Section title={t('inv.story')} alt={flip()}><Story demo={demo} /></Section>}

        <Section title={t(demo.events.length > 1 ? 'inv.events' : 'inv.event')} alt={flip()}>
          {demo.events.map((e) => <EventBlock key={e.start + e.label.en} demo={demo} e={e} />)}
          {demo.countdown && !quiet && kind !== 'foil' && <Countdown iso={first.start} />}
          <p className="iv-note iv-park">{demo.note[lang]}</p>
        </Section>

        {demo.programme && <Section title={t('inv.programme')} alt={flip()}><Programme demo={demo} /></Section>}
        {demo.gallery && !quiet && photos.some(Boolean) && <Section title={t('inv.gallery')} alt={flip()}><Gallery srcs={photos} /></Section>}
        {demo.gift && <Section title={t('inv.gift')} alt={flip()}><Gift demo={demo} /></Section>}

        <Section title={t(quiet ? 'inv.rsvp.quiet' : 'inv.rsvp')} alt={flip()} id="rsvp">
          <p className="iv-note">{t(quiet ? 'inv.rsvp.sub.quiet' : 'inv.rsvp.sub')}</p>
          <Rsvp demo={demo} guest={guest} />
        </Section>

        {demo.wishes && !quiet && <Section title={t('inv.wishes')} alt={flip()}><Wishes demo={demo} guest={guest} /></Section>}
        {hasWa && demo.contacts && <Section title={t('inv.contact')} alt={flip()}><Contacts demo={demo} /></Section>}

        <Section alt={flip()}>
          <p className="iv-closing">{demo.closing[lang]}</p>
          <p className="iv-sign">{demo.names.join(demo.joiner ? ` ${demo.joiner} ` : ' · ')}</p>
        </Section>
      </main>
    </CatCtx.Provider>
  );
}

function Invitation({ demo }: { demo: DemoInvite }) {
  const { t, lang, setLang } = useI18n();
  const [params] = useSearchParams();
  const embed = params.get('embed') === '1';
  const guest = cleanGuest(params.get('to'));
  const [phase, setPhase] = useState<Phase>('closed');
  const closed = phase === 'closed';
  const music = useMusic(demo, embed);

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
    music.start();
    window.scrollTo(0, 0);
    setPhase('opening');
  }
  const onDone = useCallback(() => setPhase((p) => (p === 'opening' ? 'open' : p)), []);
  useEffect(() => {
    if (phase === 'open') document.getElementById('iv-main')?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div className="iv" data-cat={demo.category} data-layout={coverKind(demo)} data-quiet={demo.quiet || undefined} data-embed={embed || undefined} style={themeStyle(demo.theme)} lang={lang}>
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
      {music.available && !closed && <MusicButton playing={music.playing} onToggle={music.toggle} />}
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

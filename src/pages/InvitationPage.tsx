import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { m, MotionConfig, useReducedMotion } from 'motion/react';
import type { CoverKind, DemoInvite } from '../demos/data';
import { findDemo } from '../demos/registry';
import { useI18n } from '../lib/i18n';
import { useSiteConfig } from '../lib/siteConfig';
import { waHref } from '../lib/config';
import { WhatsAppLink } from '../components/WhatsAppLink';
import { LANGS } from '../types';
import { CoverArt, CoverText, Frame, LoopClip, PortraitPanel, coverKind, designClass, fmtDate, isLong, themeStyle, useCoverBg } from '../components/card/parts';
import { CatCtx, Countdown, EventBlock, Orn, Rsvp, Section } from '../components/card/sections';
import { Contacts, Gallery, useGallery, Gift, Programme, Story, Wishes } from '../components/card/extras';
import { BIGDATE, BIGNUM, BigDate, BigNum, CoupleHeader } from '../components/card/layout';
import { MusicButton, useMusic } from '../components/card/music';
import { AutoScrollButton, useAutoScroll } from '../components/card/autoscroll';
import '../invitation.css';
import '../interior.css';

/* Guest name comes from the link (?to=Name). It is text only, trimmed and capped. */
const cleanGuest = (v: string | null): string => (v ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60);

type Phase = 'closed' | 'opening' | 'open';
type Opening = 'fold' | 'gate' | 'book' | 'flap' | 'unfold' | 'bloom';
const OPENING: Record<CoverKind, Opening> = {
  classic: 'fold', portrait: 'fold', oval: 'fold', songket: 'gate', ticket: 'gate',
  arch: 'book', age: 'book', foil: 'flap', modern: 'unfold', balloons: 'unfold', wreath: 'bloom'
};

function Cover({ demo, guest, phase, embed, slow, reduce, onOpen, onDone }: { demo: DemoInvite; guest: string; phase: Phase; embed: boolean; slow: number; reduce: boolean; onOpen: () => void; onDone: () => void }) {
  const { t, lang } = useI18n();
  const btn = useRef<HTMLButtonElement>(null);
  const opening = phase === 'opening';
  /* The tap is acknowledged first (press, 200 ms), then the swing starts. The cover is never removed before the
     swing has had its full minimum time, whatever fires the completion callback. ?anim=slow multiplies all times by 3. */
  const [armed, setArmed] = useState(false);
  const t0 = useRef(0);
  useEffect(() => {
    if (!opening) return;
    const id = window.setTimeout(() => { t0.current = performance.now(); setArmed(true); }, 200 * slow);
    return () => window.clearTimeout(id);
  }, [opening, slow]);
  const finish = useCallback(() => {
    const min = (reduce ? 1100 : 1400) * slow;
    const left = min - (performance.now() - t0.current);
    if (t0.current === 0 || left > 0) window.setTimeout(onDone, t0.current === 0 ? min : left);
    else onDone();
  }, [reduce, slow, onDone]);

  /* In the modal the close button keeps focus, so the dialog stays predictable. */
  useEffect(() => { if (!embed) btn.current?.focus({ preventScroll: true }); }, [embed]);
  useEffect(() => {
    if (!opening) return;
    // Safety net only: press + the longest swing (~1.7 s incl. delay) or the 1.1 s dissolve, plus margin.
    const id = window.setTimeout(onDone, (200 + (reduce ? 1500 : 3200)) * slow);
    return () => window.clearTimeout(id);
  }, [opening, reduce, slow, onDone]);

  const kind = coverKind(demo);
  const led = useCoverBg(demo) !== null;
  const type = OPENING[kind];
  const run = opening && armed;
  const go = run && !reduce;
  const shade = (d: number, dur: number) => (
    <m.span className="door-shade" animate={{ opacity: go ? 1 : 0 }} transition={{ duration: dur * slow, delay: d * slow, ease: 'easeIn' }} />
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
      transition={{ duration: dur * slow, delay: delay * slow, ease }}
      onAnimationComplete={() => { if (go && side === 'l') finish(); }}>
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
          <m.div className="door pn-full pn-book" aria-hidden="true" animate={{ rotateY: go ? -168 : 0 }} transition={{ duration: 1.4 * slow, delay: 0.3 * slow, ease }}
            onAnimationComplete={() => { if (go) finish(); }}>
            {art()}{shade(0.3, 1.1)}
          </m.div>
        );
      case 'unfold':
        return (
          <m.div className="door pn-full pn-up" aria-hidden="true" animate={{ rotateX: go ? 104 : 0 }} transition={{ duration: 1.3 * slow, delay: 0.3 * slow, ease }}
            onAnimationComplete={() => { if (go) finish(); }}>
            {art()}{shade(0.3, 1)}
          </m.div>
        );
      case 'flap':
        return (
          <>
            <m.div className="door pn-full pn-pocket" aria-hidden="true" animate={{ y: go ? '5%' : 0, opacity: go ? 0 : 1 }} transition={{ duration: 0.5 * slow, delay: 0.95 * slow, ease: 'easeIn' }}
              onAnimationComplete={() => { if (go) finish(); }}>
              {art()}
            </m.div>
            <m.div className="door pn-flap" aria-hidden="true" animate={{ rotateX: go ? 172 : 0 }} transition={{ duration: 1 * slow, delay: 0.3 * slow, ease }}>
              {art()}{shade(0.3, 0.8)}
            </m.div>
          </>
        );
      default: return <>{hinged('l', 105, 1.1, 0.3)}{hinged('r', 105, 1.1, 0.3)}</>;
    }
  };

  return (
    <m.div className={`cover cv-page cv-k-${kind} ${designClass(demo)}${led ? ' cv-led' : ''}`} style={themeStyle(demo.theme)} role="region" aria-label={demo.kicker[lang]}
      animate={run && reduce ? { opacity: 0, y: '-12%' } : { opacity: 1, y: 0 }}
      transition={{ duration: (reduce ? 1.1 : 0.4) * slow, ease: 'easeInOut' }}
      onAnimationComplete={() => { if (run && reduce) finish(); }}>
      <LoopClip category={demo.category} />
      {panels()}
      <m.div className="cv cv-face" animate={run ? { opacity: 0, scale: reduce ? 1 : 1.04 } : { opacity: 1, scale: 1 }} transition={{ duration: (reduce ? 0.5 : 0.35) * slow }}>
        <CoverText demo={demo} lang={lang} heading>
          {guest && (
            <p className="cv-guest"><span>{t('inv.invited')}</span><strong>{guest}</strong></p>
          )}
          <button ref={btn} className="cv-open" type="button" onClick={onOpen} disabled={opening} data-pressed={opening && !armed ? 'y' : undefined}>{t('inv.open')}</button>
        </CoverText>
      </m.div>
    </m.div>
  );
}

/* dark or light cover colour: the art veil is pushed further that way so the lettering keeps its contrast over any art */
const isDarkHex = (h: string): boolean => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.35;
};

type Tone = 'art' | 'paper';
const PREFERS_ART = new Set(['hero', 'count', 'gal', 'rsvp', 'wish', 'close']);
const ART_POS = ['0%', '100%', '38%', '72%'];

function Body({ demo, guest, hidden }: { demo: DemoInvite; guest: string; hidden: boolean }) {
  const { t, lang } = useI18n();
  const cfg = useSiteConfig();
  const hasWa = Boolean(waHref(cfg, lang));
  const first = demo.events[0];
  const quiet = demo.quiet;
  const kind = coverKind(demo);
  const photos = useGallery(demo.category, demo.gallery ?? 0);
  const showGal = Boolean(demo.gallery) && !quiet && photos.some(Boolean);

  /* Section rhythm: the hero, countdown, gallery, RSVP, wishes and the closing sit on full-bleed cover art; story, events,
     programme and gift sit on paper. Never more than two paper sections in a row: the next one is promoted to art. */
  const keys = ['hero', demo.countdown && !quiet && 'count', demo.story && 'story', 'events', demo.programme && 'prog', showGal && 'gal', demo.gift && 'gift', 'rsvp', demo.wishes && !quiet && 'wish', hasWa && demo.contacts && 'contact', 'close']
    .filter((k): k is string => typeof k === 'string');
  const plan: Record<string, { tone: Tone; bt: boolean; bb: boolean; ap: string }> = {};
  let run = 0;
  let arts = 0;
  keys.forEach((k) => {
    const tone: Tone = PREFERS_ART.has(k) || run >= 2 ? 'art' : 'paper';
    run = tone === 'paper' ? run + 1 : 0;
    plan[k] = { tone, bt: false, bb: false, ap: ART_POS[arts % ART_POS.length] };
    if (tone === 'art') arts++;
  });
  keys.forEach((k, i) => {
    if (plan[k].tone !== 'paper') return;
    plan[k].bt = i === 0 || plan[keys[i - 1]].tone === 'art';
    plan[k].bb = i === keys.length - 1 || plan[keys[i + 1]].tone === 'art';
  });
  const sec = (k: string) => ({ tone: plan[k].tone, bt: plan[k].bt, bb: plan[k].bb, ap: plan[k].ap });
  const dateLine = fmtDate(first.start, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <CatCtx.Provider value={demo.category}>
      <main className="iv-card" inert={hidden} aria-hidden={hidden || undefined} id="iv-main" tabIndex={-1}>
        <Section hero {...sec('hero')}>
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
          <p className="iv-herodate">{dateLine}</p>
          <Orn />
          <p className="iv-lead">{demo.invite[lang]}</p>
          <div className="iv-hosts">{demo.hosts[lang].map((h) => <p key={h}>{h}</p>)}</div>
          <p className="iv-scroll" aria-hidden="true"><span>{t('inv.scroll')}</span><i /></p>
        </Section>

        {plan.count && <Section title={t('inv.countdown')} {...sec('count')}><Countdown iso={first.start} /><p className="iv-note iv-after">{dateLine}</p></Section>}

        {demo.story && <Section title={t('inv.story')} {...sec('story')}><Story demo={demo} /></Section>}

        <Section title={t(demo.events.length > 1 ? 'inv.events' : 'inv.event')} {...sec('events')}>
          {demo.events.map((e) => <EventBlock key={e.start + e.label.en} demo={demo} e={e} />)}
          <p className="iv-note iv-park">{demo.note[lang]}</p>
        </Section>

        {demo.programme && <Section title={t('inv.programme')} {...sec('prog')}><Programme demo={demo} /></Section>}
        {plan.gal && <Section title={t('inv.gallery')} {...sec('gal')}><Gallery srcs={photos} /></Section>}
        {demo.gift && <Section title={t('inv.gift')} {...sec('gift')}><Gift demo={demo} /></Section>}

        <Section title={t(quiet ? 'inv.rsvp.quiet' : 'inv.rsvp')} id="rsvp" {...sec('rsvp')}>
          <p className="iv-note">{t(quiet ? 'inv.rsvp.sub.quiet' : 'inv.rsvp.sub')}</p>
          <Rsvp demo={demo} guest={guest} />
        </Section>

        {plan.wish && <Section title={t('inv.wishes')} {...sec('wish')}><Wishes demo={demo} guest={guest} /></Section>}
        {plan.contact && demo.contacts && <Section title={t('inv.contact')} {...sec('contact')}><Contacts demo={demo} /></Section>}

        <Section {...sec('close')}>
          <p className="iv-closing">{demo.closing[lang]}</p>
          <p className="iv-sign">{demo.names.join(demo.joiner ? ` ${demo.joiner} ` : ' · ')}</p>
          <span className="iv-foot" aria-hidden="true" />
        </Section>
      </main>
    </CatCtx.Provider>
  );
}

function Invitation({ demo }: { demo: DemoInvite }) {
  const { t, lang, setLang } = useI18n();
  const [params] = useSearchParams();
  const embed = params.get('embed') === '1';
  const full = params.get('anim') === 'full'; // dev/compare switch: force the full 3D swing even when the OS asks for reduced motion
  const osReduce = useReducedMotion();
  const reduce = Boolean(osReduce) && !full;
  const slow = params.get('anim') === 'slow' ? 3 : 1; // dev switch: 3x slower opening, for checking it by eye
  const guest = cleanGuest(params.get('to'));
  const [phase, setPhase] = useState<Phase>('closed');
  const closed = phase === 'closed';
  const music = useMusic(demo);
  const art = useCoverBg(demo);
  const auto = useAutoScroll(phase === 'open', reduce);

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
    setPhase('opening'); // first: nothing below may stop the animation from starting
    try { window.scrollTo(0, 0); } catch { /* ignore */ }
    try { music.start(); } catch { /* audio is optional */ }
  }
  const onDone = useCallback(() => setPhase((p) => (p === 'opening' ? 'open' : p)), []);
  useEffect(() => {
    if (phase === 'open') document.getElementById('iv-main')?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <div className={`iv ${designClass(demo)}`} data-cat={demo.category} data-cover={isDarkHex(demo.theme.cover) ? 'dark' : 'light'} data-look={demo.layout ?? coverKind(demo)} data-layout={art ? undefined : demo.layout ?? coverKind(demo)} data-quiet={demo.quiet || undefined} data-embed={embed || undefined} data-rm={reduce || undefined} data-phase={phase} style={art ? { ...themeStyle(demo.theme), '--iv-art': `url(${art})` } as CSSProperties : themeStyle(demo.theme)} data-led={art ? 'y' : undefined} lang={lang}>
      {!embed && (
        <div className="iv-top">
          <Link to={{ pathname: '/', hash: 'demos' }}>← {t('inv.back')}</Link>
          <span className="iv-sample">{t('hero.sample')}</span>
          <div className="lang" role="group" aria-label="Language">
            {LANGS.map((l) => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
          </div>
        </div>
      )}
      {art && <link rel="preload" as="image" href={art} fetchPriority="high" />}
      {phase !== 'open' && <MotionConfig reducedMotion="never"><Cover demo={demo} guest={guest} phase={phase} embed={embed} slow={slow} reduce={reduce} onOpen={onOpen} onDone={onDone} /></MotionConfig>}
      <Body demo={demo} guest={guest} hidden={closed} />
      {music.available && !closed && <MusicButton playing={music.playing} onToggle={music.toggle} />}
      {phase === 'open' && <AutoScrollButton running={auto.running} onToggle={auto.running ? auto.stop : auto.start} />}
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

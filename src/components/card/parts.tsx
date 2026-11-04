import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { CoverKind, DemoInvite, Theme } from '../../demos/data';

import type { EventType, Lang } from '../../types';
import { COVER_ART } from '../../demos/coverArt';
/* Display faces for the art-led covers (latin subset, minimal weights). Browsers fetch a face only when a cover uses it. */
import '@fontsource/great-vibes/latin-400.css';
import '@fontsource/pinyon-script/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-500.css';
import '@fontsource-variable/playfair-display/wght.css';
import '@fontsource-variable/fredoka/wght.css';
import { useI18n } from '../../lib/i18n';

export const TZ = 'Asia/Kuala_Lumpur';

/* Theme tokens become CSS custom properties on the card root; all styling reads them. */
export function themeStyle(th: Theme): CSSProperties {
  const vars: Record<string, string> = {
    '--iv-paper': th.paper, '--iv-paper2': th.paper2, '--iv-ink': th.ink, '--iv-muted': th.muted, '--iv-accent': th.accent,
    '--iv-label': th.accentText, '--iv-cover': th.cover, '--iv-cover-ink': th.coverInk, '--iv-cover-line': th.coverLine,
    '--iv-btn': th.btn, '--iv-btn-ink': th.btnInk, '--iv-seal': th.seal, '--iv-seal-ink': th.sealInk
  };
  return vars as CSSProperties;
}

/* Long names (tahlil, companies) are set smaller so they never overflow a phone. */
export const isLong = (demo: DemoInvite): boolean => demo.names.some((n) => n.split(' ').some((w) => w.length > 11) || n.length > 16);

export const fmtDate = (iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat(lang === 'ms' ? 'ms-MY' : 'en-MY', { ...opts, timeZone: TZ }).format(new Date(iso));

/* ---- Art slots -------------------------------------------------------------------------------
   Optional images made by the CEO in Gemini Flow live in public/art/. If a file is missing the
   clean CSS/SVG fallback is shown. Results are cached so a missing file is asked for only once. */
const probe = new Map<string, Promise<boolean>>();
export function artExists(src: string): Promise<boolean> {
  let p = probe.get(src);
  if (!p) {
    p = new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
    probe.set(src, p);
  }
  return p;
}

/* One continuous couple photo for the "Portrait Doors" design: public/art/portrait-couple.webp (groom cut by the left edge, bride by the right). */
export function usePortrait(): string | null {
  const src = '/art/portrait-couple.webp';
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let live = true;
    void artExists(src).then((v) => { if (live) setOk(v); });
    return () => { live = false; };
  }, [src]);
  return ok ? src : null;
}

export type ArtKind = 'corner' | 'divider' | 'seal';
export function useArt(kind: ArtKind, category: EventType, pos?: 'tl' | 'br'): string | null {
  const src = `/art/${kind}-${category}${pos ? `-${pos}` : ''}.webp`;
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let live = true;
    void artExists(src).then((v) => { if (live) setOk(v); });
    return () => { live = false; };
  }, [src]);
  return ok ? src : null;
}

/* Optional looping background clip for the cover (made in Flow). Only used when the file exists,
   the visitor has not asked for reduced motion, and data saver is off. Otherwise nothing renders. */
export function useLoopClip(category: EventType): string | null {
  const src = `/art/loop-${category}.webm`;
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduce || saver) return;
    let live = true;
    fetch(src, { method: 'HEAD' })
      .then((r) => { if (live) setOk(r.ok && (r.headers.get('content-type') ?? '').startsWith('video/')); })
      .catch(() => { /* absent: keep the CSS cover */ });
    return () => { live = false; };
  }, [src]);
  return ok ? src : null;
}

export function LoopClip({ category }: { category: EventType }) {
  const src = useLoopClip(category);
  if (!src) return null;
  return <video className="cv-loop" src={src} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />;
}

/* ---- Ornaments (geometric lines only) ------------------------------------------------------- */
const POS = ['tl', 'tr', 'bl', 'br'] as const;

function CornerFan() {
  return (
    <svg className="fr-svg" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 40A40 40 0 0 0 40 0" />
        <path d="M0 30A30 30 0 0 0 30 0" />
        <path d="M0 20A20 20 0 0 0 20 0" />
      </g>
      <path d="M3 3l3 3-3 3-3-3z" fill="currentColor" />
    </svg>
  );
}

/* Double border. With art: a large botanical corner top-left and bottom-right, like a printed card
   (either may be missing). Without art: four small geometric corners. */
export function Frame({ category, bare }: { category: EventType; bare?: boolean }) {
  const tl = useArt('corner', category, 'tl');
  const br = useArt('corner', category, 'br');
  const art = Boolean(tl || br);
  if (bare) return <div className="fr" aria-hidden="true" />;
  const fan = (p: (typeof POS)[number]) => <span key={p} className={`fr-c fr-${p}`}><CornerFan /></span>;
  return (
    <div className={`fr${art ? ' fr-art' : ''}`} aria-hidden="true">
      {art ? (
        <>
          {tl ? <img className="fr-c fr-tl" src={tl} alt="" decoding="async" /> : fan('tl')}
          {br ? <img className="fr-c fr-br" src={br} alt="" decoding="async" /> : fan('br')}
        </>
      ) : POS.map(fan)}
    </div>
  );
}

export function Divider({ category }: { category: EventType }) {
  const art = useArt('divider', category);
  if (art) return <img className="dv-art" src={art} alt="" decoding="async" />;
  return <div className="dv" aria-hidden="true"><i /></div>;
}

export function Seal({ demo }: { demo: DemoInvite }) {
  const art = useArt('seal', demo.category);
  return (
    <span className={`seal seal-${demo.seal}`} aria-hidden="true" style={art ? { backgroundImage: `url(${art})` } : undefined} data-art={art ? 'y' : undefined}>
      {demo.monogram ? <span className="seal-m">{demo.monogram}</span> : <i className="seal-d" />}
    </span>
  );
}

/* Cover lettering, shared by the full-screen cover and the gallery thumbnail. */
export function CoverText({ demo, lang, heading, children }: { demo: DemoInvite; lang: Lang; heading?: boolean; children?: ReactNode }) {
  const first = demo.events[0];
  const Names = heading ? 'h1' : 'p';
  return (
    <div className="cv-text">
      <p className="cv-kicker">{demo.kicker[lang]}</p>
      <Names className={`cv-names${isLong(demo) ? ' long' : ''}`}>
        {demo.names.map((n, i) => (
          <span key={n}>
            {i > 0 && demo.joiner && <span className="cv-join">{demo.joiner}</span>}
            <span className="cv-name">{n}</span>
          </span>
        ))}
      </Names>
      {demo.subtitle && <p className="cv-sub">{demo.subtitle[lang]}</p>}
      <div className="dv dv-cover" aria-hidden="true"><i /></div>
      <p className="cv-date">{fmtDate(first.start, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <Seal demo={demo} />
      {children}
    </div>
  );
}

/* One half of the portrait cover: the same photo in both halves, each showing its own side. Missing photo: a quiet tonal panel with a thin outline and a caption. */
export function PortraitPanel({ side, priority }: { side: 'groom' | 'bride'; priority?: boolean }) {
  const { t } = useI18n();
  const src = usePortrait();
  return (
    <div className={`pp pp-${side}${src ? '' : ' pp-empty'}`} aria-hidden="true">
      {src && <img src={src} alt="" decoding="async" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'low'} />}
      <span className="pp-cap">{t(src ? 'inv.photo.sample' : 'inv.photo.yours')}</span>
    </div>
  );
}

/* Optional full-bleed cover background per design: public/art/cover-<category>-<n>.webp (n from the id). */
export function useCoverBg(demo: DemoInvite): string | null {
  const n = demo.id.replace(/\D/g, '') || '1';
  return COVER_ART.has(`${demo.category}-${n}`) ? `/art/cover-${demo.category}-${n}.webp` : null;
}

export const designClass = (d: DemoInvite): string => `cv-d-${d.category}-${d.id.replace(/\D/g, '') || '1'}`;

export const coverKind = (d: DemoInvite): CoverKind => d.cover ?? 'classic';

function WreathSvg() {
  return (
    <svg className="d-wreath" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
        <circle r="84" opacity=".45" /><circle r="80" opacity=".25" />
        {Array.from({ length: 22 }, (_, i) => (
          <g key={i} transform={`rotate(${i * (360 / 22)}) translate(0 -82) scale(.8)`}>
            <path d={i % 2 ? 'M0 0c-7-5-9-15-3-22c7 4 8 14 3 22z' : 'M0 0c7-5 9-15 3-22c-7 4-8 14-3 22z'} fill="currentColor" fillOpacity={i % 3 ? 0.1 : 0.22} />
            {i % 4 === 0 && <circle cx="0" cy="-27" r="3" fill="currentColor" fillOpacity=".5" />}
          </g>
        ))}
      </g>
    </svg>
  );
}

function Sprig({ cls }: { cls: string }) {
  return (
    <svg className={`d-sprig ${cls}`} viewBox="0 0 120 40" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M4 30C40 28 80 20 116 6" />
        {[18, 36, 54, 72, 90].map((x, i) => <path key={x} d={`M${x} ${29 - i * 4.4}c-4-9 0-15 7-17c1 8-1 14-7 17z`} fill="currentColor" fillOpacity=".2" />)}
      </g>
    </svg>
  );
}

/* The cover's artwork: everything that is not lettering. It lives inside each opening panel (so it splits,
   folds or lifts with the paper) and, unchanged, in the gallery thumbnail. CSS in covers.css does the work. */
export function CoverArt({ demo, thumb }: { demo: DemoInvite; thumb?: boolean }) {
  const k = coverKind(demo);
  const mono = demo.monogram.replace(/[^\p{L}\p{N}]/gu, '');
  const bg = useCoverBg(demo);
  return (
    <div className="cv-art" aria-hidden="true">
      {bg && <img className="cv-bg" src={thumb ? bg.replace('/art/', '/art/thumbs/') : bg} alt="" decoding="async" {...(thumb ? { width: 240, height: 427 } : {})} loading={thumb ? 'lazy' : 'eager'} fetchPriority={thumb ? 'low' : 'high'} />}
      {!bg && <CoverShapes demo={demo} k={k} mono={mono} />}
    </div>
  );
}

/* Flat CSS composition: the fallback when a design has no art file. */
function CoverShapes({ demo, k, mono }: { demo: DemoInvite; k: CoverKind; mono: string }) {
  return (
    <>
      {k === 'classic' && <Frame category={demo.category} />}
      {k === 'portrait' && <Frame category={demo.category} bare />}
      {k === 'arch' && <><i className="d-line" /><i className="d-arch" /><b className="d-script">{mono}</b></>}
      {k === 'foil' && <><i className="d-stars" /><i className="d-vee" /><i className="d-ring" /><i className="d-rule d-rule-t" /><i className="d-rule d-rule-b" /></>}
      {k === 'oval' && <><Frame category={demo.category} bare /><i className="d-oval" /><Sprig cls="s1" /><Sprig cls="s2" /></>}
      {k === 'songket' && <><i className="d-band d-band-t" /><i className="d-band d-band-b" /><i className="d-gate" /></>}
      {k === 'modern' && <><i className="d-vline" /><i className="d-hline" /><b className="d-mono">{mono}</b></>}
      {k === 'wreath' && <WreathSvg />}
      {k === 'balloons' && <><i className="d-confetti" /><i className="d-balloon b1" /><i className="d-balloon b2" /><i className="d-balloon b3" /></>}
      {k === 'age' && <><i className="d-disc" /><b className="d-num">{mono}</b></>}
      {k === 'ticket' && <><i className="d-stub" /><i className="d-notch n1" /><i className="d-notch n2" /><i className="d-grid" /></>}
    </>
  );
}

/* Static card cover used as a gallery thumbnail. Not interactive. */
export function CoverThumb({ demo, lang }: { demo: DemoInvite; lang: Lang }) {
  const kind = coverKind(demo);
  const led = useCoverBg(demo) !== null;
  return (
    <div className={`cv cv-thumb cv-k-${kind} ${designClass(demo)}${led ? ' cv-led' : ''}`} style={themeStyle(demo.theme)} aria-hidden="true">
      {kind === 'portrait' && <div className="pp-pair"><PortraitPanel side="groom" /><PortraitPanel side="bride" /></div>}
      <CoverArt demo={demo} thumb />
      <div className="cv-thumb-in"><CoverText demo={demo} lang={lang} /></div>
    </div>
  );
}

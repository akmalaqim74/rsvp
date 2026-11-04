import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { DemoInvite, Theme } from '../../demos/data';
import type { EventType, Lang } from '../../types';
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
function artExists(src: string): Promise<boolean> {
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

/* Portrait photos for the "Portrait Doors" design: public/art/portrait-groom.webp and portrait-bride.webp. */
export function usePortrait(side: 'groom' | 'bride'): string | null {
  const src = `/art/portrait-${side}.webp`;
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

/* One half of the portrait cover. Missing photo: a quiet tonal panel with a thin outline and a caption. */
export function PortraitPanel({ side, priority }: { side: 'groom' | 'bride'; priority?: boolean }) {
  const { t } = useI18n();
  const src = usePortrait(side);
  return (
    <div className={`pp pp-${side}${src ? '' : ' pp-empty'}`} aria-hidden="true">
      {src && <img src={src} alt="" decoding="async" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'low'} />}
      <span className="pp-cap">{t(src ? 'inv.photo.sample' : 'inv.photo.yours')}</span>
    </div>
  );
}

/* Static card cover used as a gallery thumbnail. Not interactive. */
export function CoverThumb({ demo, lang }: { demo: DemoInvite; lang: Lang }) {
  return (
    <div className={`cv cv-thumb${demo.portraits ? ' cv-portrait' : ''}`} style={themeStyle(demo.theme)} aria-hidden="true">
      {demo.portraits && <div className="pp-pair"><PortraitPanel side="groom" /><PortraitPanel side="bride" /></div>}
      <Frame category={demo.category} bare={demo.portraits} />
      <div className="cv-thumb-in"><CoverText demo={demo} lang={lang} /></div>
    </div>
  );
}

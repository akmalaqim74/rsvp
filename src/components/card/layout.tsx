import type { DemoInvite } from '../../demos/data';
import type { Lang } from '../../types';
import { fmtDate, usePortrait } from './parts';

/* Inside-layout helpers. Each design's inside is the same sections laid out differently: the layout is the
   cover kind, set as data-layout on the card root, and invitation.css restyles the shared markup. The few
   things CSS cannot do are the small pieces below. */

/* Big date numerals (editorial and minimal layouts). */
export function BigDate({ iso, lang }: { iso: string; lang: Lang }) {
  const day = fmtDate(iso, lang, { day: 'numeric' });
  const month = fmtDate(iso, lang, { month: 'long', year: 'numeric' });
  const wd = fmtDate(iso, lang, { weekday: 'long' });
  return (
    <p className="iv-bigdate" aria-hidden="true"><b>{day}</b><span>{month}</span><i>{wd}</i></p>
  );
}

/* Big number (milestone and kids' layouts): the age, taken from the monogram. */
export function BigNum({ demo }: { demo: DemoInvite }) {
  const n = demo.monogram.replace(/\D/g, '');
  if (!n) return null;
  return <p className="iv-bignum" aria-hidden="true">{n}</p>;
}

/* Photo header for Portrait Doors: the couple photo again, full width, right after the cover. */
export function CoupleHeader() {
  const src = usePortrait();
  if (!src) return null;
  return <div className="iv-couple" aria-hidden="true"><img src={src} alt="" decoding="async" loading="lazy" /></div>;
}

export const BIGDATE = new Set(['arch', 'modern']);
export const BIGNUM = new Set(['age', 'balloons']);

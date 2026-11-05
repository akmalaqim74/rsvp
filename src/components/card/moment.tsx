import type { CSSProperties } from 'react';
import type { DemoInvite } from '../../demos/data';
import { useI18n } from '../../lib/i18n';
import { MOMENT_CROP } from '../../demos/momentCrops';
import { fmtDate } from './parts';

/* A framed art moment: a close crop of the cover art in a frame whose shape depends on the design.
   For photo covers this is the photo itself, so the card gets a real picture moment between the sections.
   The crop and the frame come from the design id, so neighbouring designs never share both. */
export type FrameShape = 'arch' | 'oval' | 'polaroid' | 'double';
const SHAPES: FrameShape[] = ['arch', 'polaroid', 'oval', 'double'];
const CROPS: [string, string][] = [['50% 30%', '240%'], ['20% 70%', '240%'], ['80% 40%', '240%'], ['50% 90%', '240%']];

export const designNum = (d: DemoInvite): number => parseInt(d.id.replace(/\D/g, ''), 10) || 1;
export const frameShape = (d: DemoInvite): FrameShape => SHAPES[(designNum(d) + d.category.length) % SHAPES.length];

export function Moment({ demo }: { demo: DemoInvite }) {
  const { lang } = useI18n();
  const n = designNum(demo);
  const [fallback, size] = CROPS[(n * 5 + demo.category.length) % CROPS.length];
  const pos = MOMENT_CROP[`${demo.category}-${n}`] ?? fallback;
  const style = { '--m-pos': pos, '--m-size': size } as CSSProperties;
  return (
    <figure className={`iv-moment m-${frameShape(demo)}`} style={style}>
      <div className="iv-moment-img" aria-hidden="true" />
      <figcaption>
        <span>{demo.names.join(demo.joiner ? ` ${demo.joiner} ` : ' · ')}</span>
        <time>{fmtDate(demo.events[0].start, lang, { day: 'numeric', month: 'long', year: 'numeric' })}</time>
      </figcaption>
    </figure>
  );
}

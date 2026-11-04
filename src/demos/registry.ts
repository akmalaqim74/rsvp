import type { EventType } from '../types';
import { BASE_DEMOS, type DemoInvite } from './data';
import { MORE_DEMOS } from './more';
import { COVER_ART } from './coverArt';

/* The older designs always show (wedding 4 uses photos, tahlil 1-3 have no art). A newer design (more.ts) is listed
   and routed only when its cover art file exists, so there are never flat or half-made designs. */
const hasArt = (d: DemoInvite): boolean => COVER_ART.has(`${d.category}-${d.id.replace(/\D/g, '')}`);

export const DEMOS: DemoInvite[] = [...BASE_DEMOS, ...MORE_DEMOS.filter(hasArt)];

export const findDemo = (category: string, id: string): DemoInvite | undefined =>
  DEMOS.find((d) => d.category === category && d.id === id);

export const demosFor = (category: EventType): DemoInvite[] => DEMOS.filter((d) => d.category === category);

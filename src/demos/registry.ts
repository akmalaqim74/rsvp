import type { EventType } from '../types';
import { BASE_DEMOS, type DemoInvite } from './data';
import { MORE_DEMOS, OCCASION_DEMOS } from './more';
import { COVER_ART } from './coverArt';

/* HARD RULE: a design is listed, tabbed, thumbnailed and routed only when public/art/cover-<category>-<n>.webp exists.
   No flat CSS covers ever reach a visitor. */
const hasArt = (d: DemoInvite): boolean => COVER_ART.has(`${d.category}-${d.id.replace(/\D/g, '')}`);

export const DEMOS: DemoInvite[] = [...BASE_DEMOS, ...OCCASION_DEMOS, ...MORE_DEMOS].filter(hasArt);

export const findDemo = (category: string, id: string): DemoInvite | undefined =>
  DEMOS.find((d) => d.category === category && d.id === id);

export const demosFor = (category: EventType): DemoInvite[] => DEMOS.filter((d) => d.category === category);

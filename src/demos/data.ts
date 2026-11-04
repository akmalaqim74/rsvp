import type { EventType, Lang } from '../types';

/* Sample invitations shown on the landing page. All names, dates and venues are invented.
   To add another sample, add an entry here: it is served at /{category}/{id}. */
export interface DemoInvite {
  category: EventType;
  id: string;
  title: Record<Lang, string>;
  hosts: Record<Lang, string>;
  date: string; // ISO with timezone
  venue: Record<Lang, string>;
  mapsUrl: string;
  countdown: boolean;
}

const MAPS = 'https://www.google.com/maps/search/?api=1&query=Kuala+Lumpur';

export const DEMOS: DemoInvite[] = [
  {
    category: 'wedding', id: 'id-1',
    title: { en: 'Amira & Daniel', ms: 'Amira & Daniel' },
    hosts: { en: 'The families of Amira and Daniel invite you to their wedding celebration', ms: 'Keluarga Amira dan Daniel menjemput anda ke majlis perkahwinan mereka' },
    date: '2026-12-20T19:30:00+08:00',
    venue: { en: 'Sample Hall, Kuala Lumpur', ms: 'Dewan Contoh, Kuala Lumpur' },
    mapsUrl: MAPS, countdown: true
  },
  {
    category: 'birthday', id: 'id-1',
    title: { en: 'Aqil turns 7', ms: 'Aqil genap 7 tahun' },
    hosts: { en: "Join us for Aqil's birthday party", ms: 'Jom sertai majlis hari lahir Aqil' },
    date: '2026-12-14T15:00:00+08:00',
    venue: { en: 'Sample Park, Petaling Jaya', ms: 'Taman Contoh, Petaling Jaya' },
    mapsUrl: MAPS, countdown: true
  },
  {
    category: 'funeral', id: 'id-1',
    title: { en: 'Tahlil Arwah', ms: 'Tahlil Arwah' },
    hosts: { en: 'The family invites relatives and friends to a tahlil in remembrance of the late', ms: 'Keluarga menjemput sanak saudara dan sahabat ke majlis tahlil arwah untuk allahyarham' },
    date: '2026-12-05T19:45:00+08:00',
    venue: { en: 'Sample Surau, Shah Alam', ms: 'Surau Contoh, Shah Alam' },
    mapsUrl: MAPS, countdown: false
  },
  {
    category: 'other', id: 'id-1',
    title: { en: 'Annual Dinner', ms: 'Makan Malam Tahunan' },
    hosts: { en: 'Sample Company invites you to the annual dinner', ms: 'Syarikat Contoh menjemput anda ke makan malam tahunan' },
    date: '2027-01-10T19:00:00+08:00',
    venue: { en: 'Sample Venue, Kuala Lumpur', ms: 'Lokasi Contoh, Kuala Lumpur' },
    mapsUrl: MAPS, countdown: true
  }
];

export const findDemo = (category: string, id: string): DemoInvite | undefined =>
  DEMOS.find((d) => d.category === category && d.id === id);

export const firstDemo = (category: EventType): DemoInvite | undefined =>
  DEMOS.find((d) => d.category === category);

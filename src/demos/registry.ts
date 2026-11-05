import type { EventType } from '../types';
import { BASE_DEMOS, type DemoInvite, type L } from './data';
import { MORE_DEMOS, OCCASION_DEMOS } from './more';
import { COVER_ART } from './coverArt';

/* HARD RULE: a design is listed, tabbed, thumbnailed and routed only when public/art/cover-<category>-<n>.webp exists.
   No flat CSS covers ever reach a visitor. */
const hasArt = (d: DemoInvite): boolean => COVER_ART.has(`${d.category}-${d.id.replace(/\D/g, '')}`);

/* Sample guest wishes written for the occasion: a baby page must not congratulate a "lifetime of happiness".
   Weddings keep the shared sample wishes (data.ts WISHES). */
const w = (en: string, ms: string): L => ({ en, ms });
const WISHES_BY_CATEGORY: Partial<Record<EventType, NonNullable<DemoInvite['wishes']>>> = {
  engagement: [
    { from: 'Kak Liyana', text: w('Congratulations on your engagement! Wishing you both a blessed journey.', 'Tahniah atas pertunangan! Semoga urusan dipermudahkan menuju hari bahagia.') },
    { from: 'Uncle Jeffri', text: w('So happy for you both. See you at the big day!', 'Gembira untuk kamu berdua. Jumpa di hari bahagia nanti!') }
  ],
  baby: [
    { from: 'Kak Liyana', text: w('Congratulations on your little one! Wishing the baby good health and you all the joy.', 'Tahniah atas kelahiran si kecil! Semoga sihat dan membesar dalam kasih sayang.') },
    { from: 'Uncle Jeffri', text: w('Cannot wait to meet the baby. Sending love to the whole family.', 'Tak sabar bertemu si kecil. Salam sayang untuk seluruh keluarga.') }
  ],
  birthday: [
    { from: 'Kak Liyana', text: w('Happy birthday! Wishing you a year full of joy and good health.', 'Selamat hari lahir! Semoga tahun ini penuh kegembiraan dan kesihatan.') },
    { from: 'Uncle Jeffri', text: w('We will be there. Save us some cake!', 'Kami akan datang. Simpankan kami sepotong kek!') }
  ],
  graduation: [
    { from: 'Kak Liyana', text: w('Congratulations, graduate! So proud of everything you achieved.', 'Tahniah, graduan! Bangga dengan segala pencapaian anda.') },
    { from: 'Uncle Jeffri', text: w('Wishing you every success in the next chapter.', 'Semoga berjaya dalam bab seterusnya.') }
  ],
  anniversary: [
    { from: 'Kak Liyana', text: w('Happy anniversary! Here is to many more years together.', 'Selamat ulang tahun! Semoga kasih sayang berkekalan.') },
    { from: 'Uncle Jeffri', text: w('An inspiration to all of us. See you at the celebration.', 'Inspirasi buat kami semua. Jumpa di majlis nanti.') }
  ],
  corporate: [
    { from: 'Kak Liyana', text: w('Thank you for the invitation. Looking forward to the evening.', 'Terima kasih atas jemputan. Kami menantikan majlis ini.') },
    { from: 'Uncle Jeffri', text: w('Congratulations to the whole team. See you there.', 'Tahniah kepada seluruh pasukan. Jumpa nanti.') }
  ],
  festive: [
    { from: 'Kak Liyana', text: w('Wishing you and your family a joyous festive season.', 'Semoga anda sekeluarga menikmati musim perayaan yang meriah.') },
    { from: 'Uncle Jeffri', text: w('Thank you for having us. We look forward to the open house.', 'Terima kasih menjemput kami. Kami menantikan rumah terbuka ini.') }
  ],
  other: [
    { from: 'Kak Liyana', text: w('Looking forward to celebrating with you!', 'Tak sabar untuk meraikan bersama anda!') },
    { from: 'Uncle Jeffri', text: w('Congratulations and best wishes to the family.', 'Tahniah dan salam hormat kepada keluarga.') }
  ]
};
const withWishes = (d: DemoInvite): DemoInvite => (d.wishes && WISHES_BY_CATEGORY[d.category] ? { ...d, wishes: WISHES_BY_CATEGORY[d.category] } : d);

/* Gallery order: the lead design of a category comes first (wedding: Portrait Doors, the couple photo). */
const FIRST = new Set(['wedding-id-4']);
const rank = (d: DemoInvite): number => (FIRST.has(`${d.category}-${d.id}`) ? 0 : 1);

export const DEMOS: DemoInvite[] = [...BASE_DEMOS, ...OCCASION_DEMOS, ...MORE_DEMOS].filter(hasArt).map(withWishes)
  .map((d, i) => ({ d, i })).sort((a, b) => rank(a.d) - rank(b.d) || a.i - b.i).map(({ d }) => d);

export const findDemo = (category: string, id: string): DemoInvite | undefined =>
  DEMOS.find((d) => d.category === category && d.id === id);

export const demosFor = (category: EventType): DemoInvite[] => DEMOS.filter((d) => d.category === category);

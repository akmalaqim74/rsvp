import type { EventType, Lang } from '../types';

/* Sample invitations shown in the demo gallery. Every name, date, venue and address is invented.
   To add a design, add an entry to DEMOS: it is served at /{category}/{id}.
   Dates are computed from today so a sample never shows "event is over". */

type L = Record<Lang, string>;
type LL = Record<Lang, string[]>;

/* Colours are tokens. Text pairs were measured for WCAG AA (see docs/reviews/TASK-build-review.md). */
export interface Theme {
  paper: string;      // page and card paper
  paper2: string;     // alternate section paper
  ink: string;        // body text on paper
  muted: string;      // secondary text on paper
  accent: string;     // decorative lines on paper (not used for text)
  accentText: string; // small-caps labels on paper
  cover: string;      // cover doors
  coverInk: string;   // text on cover
  coverLine: string;  // ornament lines on cover
  btn: string;        // button background on paper
  btnInk: string;     // button text
  seal: string;       // seal colour
  sealInk: string;    // monogram on seal
}

export type SealStyle = 'wax' | 'ring';

/* Cover composition. Each kind has its own layout, frame shape, ornament and opening (see covers.css and
   OPENING in InvitationPage). Adding a design = one DEMOS entry; a new kind = one CSS block + one case. */
export type CoverKind = 'classic' | 'portrait' | 'arch' | 'foil' | 'oval' | 'songket' | 'modern' | 'wreath' | 'balloons' | 'age' | 'ticket';

export interface DemoEvent {
  label: L;
  start: string;      // ISO with +08:00
  hours: number;      // length, used for the calendar file
  venue: L;
  address: string;    // invented, shown as is and used for the map search
}

export interface DemoInvite {
  category: EventType;
  id: string;
  name: L;            // design name in the gallery
  theme: Theme;
  seal: SealStyle;
  monogram: string;
  kicker: L;          // small caps line above the names
  names: string[];
  joiner?: string;    // between names, e.g. "&"
  subtitle?: L;       // under the names on the cover
  guest: string;      // sample "Specially invited" name for the demo links
  invite: L;          // sentence under the names inside
  hosts: LL;          // parents or hosts, one line each
  events: DemoEvent[];
  countdown: boolean;
  note: L;            // parking, surau, dress code
  closing: L;         // doa or closing message
  cover?: CoverKind;  // cover composition and opening; default 'classic'
  quiet: boolean;     // tahlil: no countdown flourish, respectful wording, single counter
  /* Optional sections. A design shows only the ones it defines. All content is sample. */
  story?: { when: L; title: L; text: L }[];
  programme?: { time: string; label: L }[];      // time "HH:mm", Kuala Lumpur
  gallery?: number;                              // number of photo slots (files gallery-<category>-<n>.webp)
  gift?: { bank: L; holder: string; account: string };
  wishes?: { from: string; text: L }[];
  contacts?: { name: string; role: L }[];
}

type Extras = Pick<DemoInvite, 'story' | 'programme' | 'gallery' | 'gift' | 'wishes' | 'contacts'>;

const WISHES: Extras['wishes'] = [
  { from: 'Kak Liyana', text: { en: 'Congratulations! Wishing you a lifetime of happiness.', ms: 'Tahniah! Semoga berbahagia hingga ke akhir hayat.' } },
  { from: 'Uncle Jeffri', text: { en: 'May Allah bless your home with love and calm.', ms: 'Semoga Allah memberkati rumah tangga anda dengan kasih dan ketenangan.' } }
];

/* Sample extras for wedding designs; only the names change. */
const weddingExtras = (a: string, d: string, times: [string, string, string, string, string]): Extras => ({
  story: [
    { when: { en: '2019', ms: '2019' }, title: { en: 'How we met', ms: 'Bagaimana kami bertemu' },
      text: { en: `A friend introduced ${a} and ${d} at a book club. They talked until the cafe closed.`, ms: `Seorang rakan memperkenalkan ${a} dan ${d} di kelab buku. Mereka berbual sehingga kafe tutup.` } },
    { when: { en: '2022', ms: '2022' }, title: { en: 'The proposal', ms: 'Lamaran' },
      text: { en: `On a quiet evening walk, ${d} asked the question. ${a} said yes before he finished.`, ms: `Pada satu petang yang tenang, ${d} bertanya soalan itu. ${a} berkata ya sebelum dia habis bercakap.` } },
    { when: { en: 'Today', ms: 'Hari ini' }, title: { en: 'Two families, one celebration', ms: 'Dua keluarga, satu perayaan' },
      text: { en: 'We would love you to be part of the day we become one family.', ms: 'Kami ingin anda menjadi sebahagian daripada hari kami menjadi satu keluarga.' } }
  ],
  programme: [
    { time: times[0], label: { en: 'Guests arrive', ms: 'Ketibaan tetamu' } },
    { time: times[1], label: { en: 'Arrival of the couple', ms: 'Ketibaan pengantin' } },
    { time: times[2], label: { en: 'Dinner is served', ms: 'Jamuan makan' } },
    { time: times[3], label: { en: 'Cake cutting', ms: 'Pemotongan kek' } },
    { time: times[4], label: { en: 'Photos with family', ms: 'Sesi bergambar bersama keluarga' } }
  ],
  gallery: 6,
  gift: { bank: { en: 'Sample Bank', ms: 'Bank Contoh' }, holder: `${a} (Sample)`, account: '0000 1111 2222' },
  wishes: WISHES,
  contacts: [
    { name: 'Hamdan (Sample)', role: { en: 'Bride\u2019s family', ms: 'Keluarga pengantin perempuan' } },
    { name: 'Richard (Sample)', role: { en: 'Groom\u2019s family', ms: 'Keluarga pengantin lelaki' } }
  ]
});

const partyExtras = (times: [string, string, string], labels: [L, L, L], gallery: number): Extras => ({
  programme: times.map((time, i) => ({ time, label: labels[i] })),
  gallery, wishes: WISHES,
  contacts: [{ name: 'Salwa (Sample)', role: { en: 'Host', ms: 'Tuan rumah' } }]
});

const TZ_OFFSET = '+08:00';

/* Next given weekday (0 Sun .. 6 Sat), at least minDays from today in Kuala Lumpur, at HH:mm. */
function upcoming(weekday: number, minDays: number, time: string): string {
  const now = new Date(Date.now() + 8 * 3600000); // shift so UTC getters read Kuala Lumpur time
  const base = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) + minDays * 86400000;
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + ((weekday - d.getUTCDay() + 7) % 7));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}T${time}:00${TZ_OFFSET}`;
}

const SAMPLE_NOTE_PARK: L = {
  en: 'Parking is free behind the hall. A prayer room (surau) is on the ground floor.',
  ms: 'Tempat letak kereta percuma di belakang dewan. Surau disediakan di tingkat bawah.'
};

const TAHLIL_PROG: Extras['programme'] = [
  { time: '20:00', label: { en: 'Surah Yasin', ms: 'Bacaan Yasin' } },
  { time: '20:20', label: { en: 'Tahlil', ms: 'Tahlil' } },
  { time: '20:40', label: { en: 'Doa', ms: 'Doa' } },
  { time: '21:00', label: { en: 'Light refreshments', ms: 'Jamuan ringan' } }
];

export const DEMOS: DemoInvite[] = [
  /* ---------- Wedding (the lead design is ivory, gold and blush; sage stays as a later option) ---------- */
  {
    category: 'wedding', id: 'id-1', ...weddingExtras('Amira', 'Daniel', ['19:00', '19:30', '20:00', '21:00', '21:30']),
    name: { en: 'Ivory and Gold', ms: 'Gading dan Emas' },
    theme: { paper: '#FCF8F2', paper2: '#F8ECE7', ink: '#3A2E2C', muted: '#5F504C', accent: '#B8935A', accentText: '#7A5A1E',
      cover: '#F5ECDD', coverInk: '#3A2E2C', coverLine: '#B8935A', btn: '#7A5A2A', btnInk: '#FCF8F2', seal: '#9C4F58', sealInk: '#FFF6F2' },
    seal: 'wax', monogram: 'A·D',
    kicker: { en: 'The wedding of', ms: 'Majlis perkahwinan' },
    names: ['Amira', 'Daniel'], joiner: '&', guest: 'Datin Norlela',
    invite: { en: 'Together with their families, Amira and Daniel invite you to share in the joy of their wedding.', ms: 'Bersama keluarga, Amira dan Daniel menjemput anda meraikan hari bahagia mereka.' },
    hosts: {
      en: ['Daughter of Encik Hamdan and Puan Rohana', 'Son of Encik Richard and Puan Mariam'],
      ms: ['Puteri kepada Encik Hamdan dan Puan Rohana', 'Putera kepada Encik Richard dan Puan Mariam']
    },
    events: [
      { label: { en: 'Akad nikah', ms: 'Akad nikah' }, start: upcoming(6, 42, '10:00'), hours: 2,
        venue: { en: 'Sample Mosque', ms: 'Masjid Contoh' }, address: 'Jalan Contoh 1, Seksyen 7, 40000 Shah Alam' },
      { label: { en: 'Reception', ms: 'Majlis resepsi' }, start: upcoming(6, 42, '19:30'), hours: 4,
        venue: { en: 'Sample Hall', ms: 'Dewan Contoh' }, address: 'Jalan Contoh 2, 50450 Kuala Lumpur' }
    ],
    countdown: true, note: SAMPLE_NOTE_PARK,
    closing: { en: 'Your presence and your prayers are the best gift we could receive. May Allah bless this union.', ms: 'Kehadiran dan doa anda adalah hadiah terindah buat kami. Semoga Allah memberkati perkahwinan ini.' },
    quiet: false
  },
  {
    category: 'wedding', id: 'id-2', ...weddingExtras('Nadia', 'Farhan', ['11:00', '11:30', '12:00', '13:00', '13:30']), name: { en: 'Blush Rose', ms: 'Mawar Merah Jambu' },
    theme: { paper: '#FCF4F1', paper2: '#F6E7E2', ink: '#4A2C33', muted: '#6B4F55', accent: '#C08A86', accentText: '#8A3F49',
      cover: '#F0D9D4', coverInk: '#4A2C33', coverLine: '#A8605F', btn: '#6E2F3B', btnInk: '#FFF8F5', seal: '#8A2F3F', sealInk: '#FFF1EC' },
    seal: 'wax', monogram: 'N·F',
    cover: 'arch',
    kicker: { en: 'Walimatul urus', ms: 'Walimatul urus' },
    names: ['Nadia', 'Farhan'], joiner: '&', guest: 'Puan Sri Hasnah',
    invite: { en: 'With joy in our hearts, we invite you to the wedding of our children.', ms: 'Dengan penuh kesyukuran, kami menjemput anda ke majlis perkahwinan anak-anak kami.' },
    hosts: {
      en: ['Daughter of Dato’ Salleh and Datin Zainab', 'Son of Encik Kamal and Puan Aishah'],
      ms: ['Puteri kepada Dato’ Salleh dan Datin Zainab', 'Putera kepada Encik Kamal dan Puan Aishah']
    },
    events: [
      { label: { en: 'Wedding reception', ms: 'Majlis walimatul urus' }, start: upcoming(0, 45, '11:30'), hours: 4,
        venue: { en: 'Sample Ballroom', ms: 'Balai Contoh' }, address: 'Persiaran Contoh 5, 47810 Petaling Jaya' }
    ],
    countdown: true, note: SAMPLE_NOTE_PARK,
    closing: { en: 'We look forward to celebrating with you.', ms: 'Kami menantikan kehadiran anda untuk meraikan bersama.' },
    quiet: false
  },
  {
    category: 'wedding', id: 'id-3', ...weddingExtras('Sarah', 'Adam', ['19:30', '20:00', '20:30', '21:30', '22:00']), name: { en: 'Midnight Navy', ms: 'Biru Malam' },
    theme: { paper: '#101D36', paper2: '#182A4B', ink: '#F4ECD6', muted: '#C3CBDB', accent: '#C7A55A', accentText: '#E2C57E',
      cover: '#14233F', coverInk: '#F2E8CF', coverLine: '#C7A55A', btn: '#C7A55A', btnInk: '#101D36', seal: '#C7A55A', sealInk: '#14233F' },
    seal: 'wax', monogram: 'S·A',
    cover: 'foil',
    kicker: { en: 'The wedding of', ms: 'Majlis perkahwinan' },
    names: ['Sarah', 'Adam'], joiner: '&', guest: 'Encik Jeffri dan keluarga',
    invite: { en: 'Sarah and Adam request the pleasure of your company at their wedding dinner.', ms: 'Sarah dan Adam dengan hormatnya menjemput anda ke majlis makan malam perkahwinan mereka.' },
    hosts: {
      en: ['Daughter of Encik Ismail and Puan Latifah', 'Son of Encik Zulkifli and Puan Salmah'],
      ms: ['Puteri kepada Encik Ismail dan Puan Latifah', 'Putera kepada Encik Zulkifli dan Puan Salmah']
    },
    events: [
      { label: { en: 'Wedding dinner', ms: 'Majlis makan malam' }, start: upcoming(5, 50, '20:00'), hours: 3,
        venue: { en: 'Sample Grand Hotel', ms: 'Hotel Contoh' }, address: 'Jalan Contoh 8, 50088 Kuala Lumpur' }
    ],
    countdown: true,
    note: { en: 'Smart attire, please. Valet parking is available at the hotel lobby.', ms: 'Pakaian kemas. Perkhidmatan valet tersedia di lobi hotel.' },
    closing: { en: 'We would be honoured to have you with us.', ms: 'Kehadiran anda amat kami hargai.' },
    quiet: false
  },
  {
    category: 'wedding', id: 'id-4', ...weddingExtras('Aisyah', 'Hafiz', ['19:00', '19:30', '20:00', '21:00', '21:30']),
    name: { en: 'Portrait Doors', ms: 'Pintu Potret' },
    theme: { paper: '#FCF8F2', paper2: '#F8ECE7', ink: '#3A2E2C', muted: '#5F504C', accent: '#B8935A', accentText: '#7A5A1E',
      cover: '#F4F2EF', coverInk: '#3A2E2C', coverLine: '#B8935A', btn: '#7A5A2A', btnInk: '#FCF8F2', seal: '#9C4F58', sealInk: '#FFF6F2' },
    seal: 'wax', monogram: 'A·H', cover: 'portrait',
    kicker: { en: 'The wedding of', ms: 'Majlis perkahwinan' },
    names: ['Aisyah', 'Hafiz'], joiner: '&', guest: 'Puan Sri Hasnah',
    invite: { en: 'Together with their families, Aisyah and Hafiz invite you to share in the joy of their wedding.', ms: 'Bersama keluarga, Aisyah dan Hafiz menjemput anda meraikan hari bahagia mereka.' },
    hosts: {
      en: ['Daughter of Encik Rashid and Puan Norma', 'Son of Encik Azman and Puan Faridah'],
      ms: ['Puteri kepada Encik Rashid dan Puan Norma', 'Putera kepada Encik Azman dan Puan Faridah']
    },
    events: [
      { label: { en: 'Akad nikah', ms: 'Akad nikah' }, start: upcoming(6, 42, '11:00'), hours: 2,
        venue: { en: 'Sample Mosque', ms: 'Masjid Contoh' }, address: 'Jalan Contoh 4, Seksyen 14, 40000 Shah Alam' },
      { label: { en: 'Reception', ms: 'Majlis resepsi' }, start: upcoming(6, 42, '19:30'), hours: 4,
        venue: { en: 'Sample Hall', ms: 'Dewan Contoh' }, address: 'Jalan Contoh 9, 50450 Kuala Lumpur' }
    ],
    countdown: true, note: SAMPLE_NOTE_PARK,
    closing: { en: 'Your presence and your prayers are the best gift we could receive. May Allah bless this union.', ms: 'Kehadiran dan doa anda adalah hadiah terindah buat kami. Semoga Allah memberkati perkahwinan ini.' },
    quiet: false
  },
  {
    category: 'wedding', id: 'id-5', ...weddingExtras('Hana', 'Irfan', ['19:00', '19:30', '20:00', '21:00', '21:30']), name: { en: 'Sage and Gold', ms: 'Hijau Sage dan Emas' },
    theme: { paper: '#FBF7EE', paper2: '#F3EDDD', ink: '#2B3A33', muted: '#55625B', accent: '#B8975A', accentText: '#7A5E1F',
      cover: '#2F4A3F', coverInk: '#F4ECD8', coverLine: '#C9A96B', btn: '#2F4A3F', btnInk: '#FBF7EE', seal: '#C9A96B', sealInk: '#2B3A33' },
    seal: 'wax', monogram: 'H·I',
    cover: 'oval',
    kicker: { en: 'The wedding of', ms: 'Majlis perkahwinan' },
    names: ['Hana', 'Irfan'], joiner: '&', guest: 'Datin Norlela',
    invite: { en: 'Together with their families, Hana and Irfan invite you to share in the joy of their wedding.', ms: 'Bersama keluarga, Hana dan Irfan menjemput anda meraikan hari bahagia mereka.' },
    hosts: {
      en: ['Daughter of Encik Hamdan and Puan Rohana', 'Son of Encik Richard and Puan Mariam'],
      ms: ['Puteri kepada Encik Hamdan dan Puan Rohana', 'Putera kepada Encik Richard dan Puan Mariam']
    },
    events: [
      { label: { en: 'Akad nikah', ms: 'Akad nikah' }, start: upcoming(6, 42, '10:00'), hours: 2,
        venue: { en: 'Sample Mosque', ms: 'Masjid Contoh' }, address: 'Jalan Contoh 1, Seksyen 7, 40000 Shah Alam' },
      { label: { en: 'Reception', ms: 'Majlis resepsi' }, start: upcoming(6, 42, '19:30'), hours: 4,
        venue: { en: 'Sample Hall', ms: 'Dewan Contoh' }, address: 'Jalan Contoh 2, 50450 Kuala Lumpur' }
    ],
    countdown: true, note: SAMPLE_NOTE_PARK,
    closing: { en: 'Your presence and your prayers are the best gift we could receive. May Allah bless this union.', ms: 'Kehadiran dan doa anda adalah hadiah terindah buat kami. Semoga Allah memberkati perkahwinan ini.' },
    quiet: false
  },

  {
    category: 'wedding', id: 'id-6', ...weddingExtras('Nurul Ain', 'Haziq', ['19:00', '19:30', '20:00', '21:00', '21:30']), name: { en: 'Malay Songket', ms: 'Songket Melayu' },
    theme: { paper: '#FBF3EA', paper2: '#F3E4D6', ink: '#3B1D1F', muted: '#5E4343', accent: '#B8893A', accentText: '#7A4F12',
      cover: '#5B1A24', coverInk: '#F8E9C8', coverLine: '#D4A94F', btn: '#6E1F2B', btnInk: '#FBF3EA', seal: '#D4A94F', sealInk: '#4A1019' },
    seal: 'wax', monogram: 'N·H', cover: 'songket',
    kicker: { en: 'The wedding of', ms: 'Majlis perkahwinan' },
    names: ['Nurul Ain', 'Haziq'], joiner: '&', guest: 'Puan Sri Rohani',
    invite: { en: 'Together with their families, Nurul Ain and Haziq invite you to share in the joy of their wedding.', ms: 'Bersama keluarga, Nurul Ain dan Haziq menjemput anda meraikan hari bahagia mereka.' },
    hosts: {
      en: ['Daughter of Encik Kamal and Puan Zalina', 'Son of Encik Rosli and Puan Hasnah'],
      ms: ['Puteri kepada Encik Kamal and Puan Zalina', 'Putera kepada Encik Rosli and Puan Hasnah']
    },
    events: [
      { label: { en: 'Akad nikah', ms: 'Akad nikah' }, start: upcoming(6, 49, '11:00'), hours: 2,
        venue: { en: 'Sample Mosque', ms: 'Masjid Contoh' }, address: 'Jalan Contoh 5, Seksyen 3, 40000 Shah Alam' },
      { label: { en: 'Reception', ms: 'Majlis resepsi' }, start: upcoming(6, 49, '13:00'), hours: 4,
        venue: { en: 'Sample Grand Hall', ms: 'Dewan Besar Contoh' }, address: 'Jalan Contoh 8, 50450 Kuala Lumpur' }
    ],
    countdown: true, note: SAMPLE_NOTE_PARK,
    closing: { en: 'Your presence and your prayers are the best gift we could receive. May Allah bless this union.', ms: 'Kehadiran dan doa anda adalah hadiah terindah buat kami. Semoga Allah memberkati perkahwinan ini.' },
    quiet: false
  },
  {
    category: 'wedding', id: 'id-7', ...weddingExtras('Zara', 'Ilyas', ['19:00', '19:30', '20:00', '21:00', '21:30']), name: { en: 'Minimal Modern', ms: 'Moden Minimalis' },
    theme: { paper: '#FAFAF8', paper2: '#F0F0EC', ink: '#1B1B1B', muted: '#4F4F4A', accent: '#BDBDB5', accentText: '#3F3F3A',
      cover: '#F2F1EC', coverInk: '#1B1B1B', coverLine: '#8A8A82', btn: '#1B1B1B', btnInk: '#FAFAF8', seal: '#1B1B1B', sealInk: '#FAFAF8' },
    seal: 'wax', monogram: 'Z·I', cover: 'modern',
    kicker: { en: 'The wedding of', ms: 'Majlis perkahwinan' },
    names: ['Zara', 'Ilyas'], joiner: '&', guest: 'Cik Aliya',
    invite: { en: 'Together with their families, Zara and Ilyas invite you to share in the joy of their wedding.', ms: 'Bersama keluarga, Zara dan Ilyas menjemput anda meraikan hari bahagia mereka.' },
    hosts: {
      en: ['Daughter of Encik Haris and Puan Sarah', 'Son of Encik Ismail and Puan Mariana'],
      ms: ['Puteri kepada Encik Haris and Puan Sarah', 'Putera kepada Encik Ismail and Puan Mariana']
    },
    events: [
      { label: { en: 'Akad nikah', ms: 'Akad nikah' }, start: upcoming(6, 56, '10:30'), hours: 2,
        venue: { en: 'Sample Chapel Hall', ms: 'Dewan Kapel Contoh' }, address: 'Jalan Contoh 11, 47500 Subang Jaya' },
      { label: { en: 'Reception', ms: 'Majlis resepsi' }, start: upcoming(6, 56, '19:00'), hours: 4,
        venue: { en: 'Sample Loft Venue', ms: 'Tempat Loft Contoh' }, address: 'Jalan Contoh 14, 50450 Kuala Lumpur' }
    ],
    countdown: true, note: SAMPLE_NOTE_PARK,
    closing: { en: 'Your presence and your prayers are the best gift we could receive. May Allah bless this union.', ms: 'Kehadiran dan doa anda adalah hadiah terindah buat kami. Semoga Allah memberkati perkahwinan ini.' },
    quiet: false
  },
  {
    category: 'wedding', id: 'id-8', ...weddingExtras('Maya', 'Zulkifli', ['16:00', '16:30', '17:00', '18:00', '18:30']), name: { en: 'Garden Watercolour', ms: 'Taman Warna Air' },
    theme: { paper: '#FBF7F5', paper2: '#F3EAF0', ink: '#3B3340', muted: '#5E5364', accent: '#B79CC2', accentText: '#6A4A7C',
      cover: '#F6EEF3', coverInk: '#3B3340', coverLine: '#8E6FA0', btn: '#6A4A7C', btnInk: '#FBF7F5', seal: '#6A4A7C', sealInk: '#FFFFFF' },
    seal: 'wax', monogram: 'M·Z', cover: 'wreath',
    kicker: { en: 'The wedding of', ms: 'Majlis perkahwinan' },
    names: ['Maya', 'Zulkifli'], joiner: '&', guest: 'Kak Intan',
    invite: { en: 'Together with their families, Maya and Zulkifli invite you to share in the joy of their wedding.', ms: 'Bersama keluarga, Maya dan Zulkifli menjemput anda meraikan hari bahagia mereka.' },
    hosts: {
      en: ['Daughter of Encik Hasan and Puan Mastura', 'Son of Encik Bakar and Puan Salmah'],
      ms: ['Puteri kepada Encik Hasan and Puan Mastura', 'Putera kepada Encik Bakar and Puan Salmah']
    },
    events: [
      { label: { en: 'Akad nikah', ms: 'Akad nikah' }, start: upcoming(6, 63, '11:00'), hours: 2,
        venue: { en: 'Sample Garden Pavilion', ms: 'Pavilion Taman Contoh' }, address: 'Jalan Contoh 3, 43000 Kajang' },
      { label: { en: 'Reception', ms: 'Majlis resepsi' }, start: upcoming(6, 63, '16:00'), hours: 4,
        venue: { en: 'Sample Garden Lawn', ms: 'Halaman Taman Contoh' }, address: 'Jalan Contoh 3, 43000 Kajang' }
    ],
    countdown: true, note: SAMPLE_NOTE_PARK,
    closing: { en: 'Your presence and your prayers are the best gift we could receive. May Allah bless this union.', ms: 'Kehadiran dan doa anda adalah hadiah terindah buat kami. Semoga Allah memberkati perkahwinan ini.' },
    quiet: false
  },

  /* ---------- Birthday ---------- */
  {
    category: 'birthday', id: 'id-1', ...partyExtras(['15:00', '16:00', '16:30'], [{ en: 'Arrival and games', ms: 'Ketibaan dan permainan' }, { en: 'Cake and singing', ms: 'Kek dan nyanyian' }, { en: 'Goodie bags', ms: 'Beg cenderahati' }], 4), name: { en: 'Warm Terracotta', ms: 'Terakota Hangat' },
    theme: { paper: '#FFF7EC', paper2: '#F8EBDA', ink: '#3A2418', muted: '#6B4A38', accent: '#D98B4E', accentText: '#963F14',
      cover: '#9A431F', coverInk: '#FFF3E2', coverLine: '#F0C79B', btn: '#9A431F', btnInk: '#FFF7EC', seal: '#FFF3E2', sealInk: '#7A3213' },
    seal: 'wax', monogram: '7',
    cover: 'age',
    kicker: { en: 'You are invited to celebrate', ms: 'Anda dijemput meraikan' },
    names: ['Aqil'], subtitle: { en: 'turns seven', ms: 'genap tujuh tahun' }, guest: 'Auntie Mei Ling',
    invite: { en: 'Please join us for cake, games and good company at Aqil’s seventh birthday.', ms: 'Jom sertai kami untuk kek, permainan dan bersama-sama meraikan hari lahir Aqil yang ketujuh.' },
    hosts: { en: ['Hosted by Encik Amin and Puan Salwa'], ms: ['Tuan rumah: Encik Amin dan Puan Salwa'] },
    events: [
      { label: { en: 'Birthday party', ms: 'Majlis hari lahir' }, start: upcoming(0, 21, '15:00'), hours: 3,
        venue: { en: 'Sample Park Pavilion', ms: 'Pavilion Taman Contoh' }, address: 'Jalan Taman Contoh 3, 47400 Petaling Jaya' }
    ],
    countdown: true,
    note: { en: 'Bring a hat and water bottle. The pavilion is shaded.', ms: 'Bawa topi dan botol air. Pavilion ini beteduh.' },
    closing: { en: 'Thank you for making his day special.', ms: 'Terima kasih kerana meraikan hari istimewanya.' },
    quiet: false
  },
  {
    category: 'birthday', id: 'id-2', ...partyExtras(['19:00', '20:00', '21:30'], [{ en: 'Welcome drinks', ms: 'Minuman alu-aluan' }, { en: 'Dinner', ms: 'Makan malam' }, { en: 'Toast and cake', ms: 'Ucapan dan kek' }], 4), name: { en: 'Plum and Champagne', ms: 'Ungu Plum dan Champagne' },
    theme: { paper: '#FAF5F0', paper2: '#F1E8DF', ink: '#2E1F2B', muted: '#5E4B5A', accent: '#D8BC8A', accentText: '#6B4B7A',
      cover: '#3E2A3F', coverInk: '#F6EBDD', coverLine: '#D8BC8A', btn: '#5B3A5C', btnInk: '#FAF5F0', seal: '#D8BC8A', sealInk: '#3E2A3F' },
    seal: 'wax', monogram: '30',
    cover: 'foil',
    kicker: { en: 'An evening to celebrate', ms: 'Malam meraikan' },
    names: ['Sofea'], subtitle: { en: 'thirty and thriving', ms: 'tiga puluh tahun' }, guest: 'Kak Liyana',
    invite: { en: 'Dinner, music and a toast to Sofea’s 30th. Dress in your favourite jewel tone.', ms: 'Makan malam, muzik dan ucapan sempena ulang tahun ke-30 Sofea. Pakai warna permata kegemaran anda.' },
    hosts: { en: ['Hosted by her family and friends'], ms: ['Dianjurkan oleh keluarga dan sahabat'] },
    events: [
      { label: { en: 'Birthday dinner', ms: 'Makan malam hari lahir' }, start: upcoming(6, 28, '19:00'), hours: 4,
        venue: { en: 'Sample Rooftop Lounge', ms: 'Lounge Bumbung Contoh' }, address: 'Jalan Contoh 12, 50450 Kuala Lumpur' }
    ],
    countdown: true, note: { en: 'Valet parking at the podium level. Halal menu.', ms: 'Valet di aras podium. Menu halal.' },
    closing: { en: 'Your company is the best present.', ms: 'Kehadiran anda adalah hadiah terbaik.' },
    quiet: false
  },

  {
    category: 'birthday', id: 'id-3', ...partyExtras(['14:00', '15:00', '16:00'], [{ en: 'Arrival and face painting', ms: 'Ketibaan dan lukisan muka' }, { en: 'Games and magic show', ms: 'Permainan dan persembahan silap mata' }, { en: 'Cake and goodie bags', ms: 'Kek dan beg cenderahati' }], 4), name: { en: 'Bright Balloons', ms: 'Belon Ceria' },
    theme: { paper: '#FFFBF0', paper2: '#FFF1D6', ink: '#1F2A44', muted: '#46506B', accent: '#FF7A59', accentText: '#B2391A',
      cover: '#2058C9', coverInk: '#FFFFFF', coverLine: '#FFD23F', btn: '#C73E1D', btnInk: '#FFFBF0', seal: '#FFD23F', sealInk: '#1F2A44' },
    seal: 'wax', monogram: '5', cover: 'balloons',
    kicker: { en: 'Come and celebrate', ms: 'Jom meriahkan' },
    names: ['Danish'], subtitle: { en: 'is five!', ms: 'genap lima tahun!' }, guest: 'Mak Cik Rina',
    invite: { en: 'Balloons, games and cake! Please join us for Danish’s fifth birthday party.', ms: 'Belon, permainan dan kek! Jom sertai majlis hari lahir Danish yang kelima.' },
    hosts: { en: ['Hosted by Encik Zaki and Puan Dina'], ms: ['Tuan rumah: Encik Zaki dan Puan Dina'] },
    events: [
      { label: { en: 'Birthday party', ms: 'Majlis hari lahir' }, start: upcoming(0, 35, '14:00'), hours: 3,
        venue: { en: 'Sample Play Hall', ms: 'Dewan Permainan Contoh' }, address: 'Jalan Contoh 6, 47301 Petaling Jaya' }
    ],
    countdown: true, note: { en: 'Wear comfortable clothes. Socks are needed in the bouncy castle.', ms: 'Pakai pakaian selesa. Stokin diperlukan di istana lantun.' },
    closing: { en: 'Thank you for celebrating with us!', ms: 'Terima kasih kerana meraikan bersama kami!' },
    quiet: false
  },
  {
    category: 'birthday', id: 'id-4', ...partyExtras(['16:00', '16:30', '18:00'], [{ en: 'High tea', ms: 'Minum petang' }, { en: 'Garden games', ms: 'Permainan taman' }, { en: 'Cake and photos', ms: 'Kek dan bergambar' }], 4), name: { en: 'Garden Party', ms: 'Majlis Taman' },
    theme: { paper: '#F8FAF4', paper2: '#EBF1E4', ink: '#2C3A2B', muted: '#4D5E4B', accent: '#9DBB98', accentText: '#35612F',
      cover: '#EAF2E6', coverInk: '#2C3A2B', coverLine: '#5F8D5A', btn: '#3E6B3A', btnInk: '#F8FAF4', seal: '#3E6B3A', sealInk: '#FFFFFF' },
    seal: 'wax', monogram: '25', cover: 'wreath',
    kicker: { en: 'A garden party for', ms: 'Majlis taman untuk' },
    names: ['Nadiah'], subtitle: { en: 'turns twenty-five', ms: 'genap dua puluh lima' }, guest: 'Kak Wani',
    invite: { en: 'High tea on the lawn, flowers and a slice of cake. Please join us for Nadiah’s 25th.', ms: 'Minum petang di halaman, bunga dan sepotong kek. Sila sertai ulang tahun ke-25 Nadiah.' },
    hosts: { en: ['Hosted by her sisters'], ms: ['Dianjurkan oleh adik-beradik'] },
    events: [
      { label: { en: 'Garden party', ms: 'Majlis taman' }, start: upcoming(6, 42, '16:00'), hours: 3,
        venue: { en: 'Sample Tea Garden', ms: 'Taman Teh Contoh' }, address: 'Jalan Contoh 9, 50480 Kuala Lumpur' }
    ],
    countdown: true, note: { en: 'Floral or pastel dress code. The garden is outdoors, shaded.', ms: 'Pakaian bunga atau warna pastel. Taman ini terbuka dan beteduh.' },
    closing: { en: 'Your company makes the day.', ms: 'Kehadiran anda menyerikan hari ini.' },
    quiet: false
  },

  /* ---------- Tahlil (route key stays "funeral") ---------- */
  {
    category: 'funeral', id: 'id-1', programme: TAHLIL_PROG, name: { en: 'Quiet Green', ms: 'Hijau Tenang' },
    theme: { paper: '#F2F5F2', paper2: '#E6ECE8', ink: '#22302B', muted: '#4B5A54', accent: '#8FA39A', accentText: '#3D5A4C',
      cover: '#3D544A', coverInk: '#EEF2EE', coverLine: '#A9BDB3', btn: '#3D544A', btnInk: '#F2F5F2', seal: '#3D544A', sealInk: '#EEF2EE' },
    seal: 'ring', monogram: '',
    kicker: { en: 'Tahlil and doa arwah', ms: 'Tahlil dan doa arwah' },
    names: ['Allahyarham', 'Hj. Ahmad bin Contoh'], subtitle: { en: 'Al-Fatihah', ms: 'Al-Fatihah' }, guest: 'Keluarga Encik Rahim',
    invite: { en: 'The family invites relatives and friends to a tahlil and doa in remembrance of the late.', ms: 'Keluarga menjemput sanak saudara dan sahabat ke majlis tahlil dan doa untuk allahyarham.' },
    hosts: { en: ['On behalf of the family'], ms: ['Bagi pihak keluarga'] },
    events: [
      { label: { en: 'Tahlil and doa', ms: 'Tahlil dan doa' }, start: upcoming(4, 4, '20:00'), hours: 2,
        venue: { en: 'Sample Surau', ms: 'Surau Contoh' }, address: 'Lorong Contoh 4, Seksyen 9, 40100 Shah Alam' }
    ],
    countdown: false,
    note: { en: 'Light refreshments will be served after the doa. Parking is along the road beside the surau.', ms: 'Jamuan ringan disediakan selepas doa. Letak kereta di sepanjang jalan bersebelahan surau.' },
    closing: { en: 'May Allah forgive him, have mercy on him, and place him among the righteous.', ms: 'Semoga Allah mengampuni dan merahmatinya, serta menempatkannya bersama orang-orang yang soleh.' },
    quiet: true
  },
  {
    category: 'funeral', id: 'id-2', programme: TAHLIL_PROG, name: { en: 'Soft Slate', ms: 'Kelabu Lembut' },
    theme: { paper: '#F3F4F6', paper2: '#E7EAEE', ink: '#1F2A36', muted: '#4A5663', accent: '#A8B4C0', accentText: '#3F5266',
      cover: '#394A5C', coverInk: '#EEF1F4', coverLine: '#B2BDC8', btn: '#394A5C', btnInk: '#F3F4F6', seal: '#394A5C', sealInk: '#EEF1F4' },
    seal: 'ring', monogram: '',
    kicker: { en: 'In loving memory', ms: 'Dalam kenangan' },
    names: ['Allahyarhamah', 'Hjh. Fatimah binti Sample'], subtitle: { en: 'Doa and tahlil', ms: 'Doa dan tahlil' }, guest: 'Puan Kamariah',
    invite: { en: 'The family would be grateful for your presence and your prayers.', ms: 'Keluarga amat menghargai kehadiran dan doa anda.' },
    hosts: { en: ['The family of the late'], ms: ['Keluarga allahyarhamah'] },
    events: [
      { label: { en: 'Doa and tahlil', ms: 'Doa dan tahlil' }, start: upcoming(4, 7, '20:15'), hours: 2,
        venue: { en: 'Residence of the family', ms: 'Kediaman keluarga' }, address: 'No. 12, Jalan Contoh 6, 43000 Kajang' }
    ],
    countdown: false,
    note: { en: 'Please park on the main road so the lane stays clear.', ms: 'Sila letak kenderaan di jalan utama supaya lorong tidak sesak.' },
    closing: { en: 'Thank you for your prayers.', ms: 'Terima kasih atas doa anda.' },
    quiet: true
  },

  {
    category: 'funeral', id: 'id-3', programme: TAHLIL_PROG, name: { en: 'Warm Cream', ms: 'Krim Hangat' },
    theme: { paper: '#F7F3EA', paper2: '#EEE8DA', ink: '#2F2A20', muted: '#58503F', accent: '#B8AD92', accentText: '#5A4E34',
      cover: '#F3EDE0', coverInk: '#3A3226', coverLine: '#9B8E72', btn: '#5A4E3A', btnInk: '#F7F3EA', seal: '#5A4E3A', sealInk: '#F7F3EA' },
    seal: 'ring', monogram: '',
    kicker: { en: 'Doa and tahlil', ms: 'Doa dan tahlil' },
    names: ['Allahyarham', 'Hj. Salleh bin Sample'], subtitle: { en: 'Al-Fatihah', ms: 'Al-Fatihah' }, guest: 'Keluarga Encik Yusof',
    invite: { en: 'The family invites you to a doa and tahlil in remembrance of the late.', ms: 'Keluarga menjemput anda ke majlis doa dan tahlil untuk allahyarham.' },
    hosts: { en: ['On behalf of the family'], ms: ['Bagi pihak keluarga'] },
    events: [
      { label: { en: 'Doa and tahlil', ms: 'Doa dan tahlil' }, start: upcoming(5, 6, '20:30'), hours: 2,
        venue: { en: 'Sample Surau', ms: 'Surau Contoh' }, address: 'Lorong Contoh 2, Seksyen 11, 40100 Shah Alam' }
    ],
    countdown: false,
    note: { en: 'Light refreshments will be served after the doa.', ms: 'Jamuan ringan disediakan selepas doa.' },
    closing: { en: 'May Allah grant him mercy and a place in Jannah.', ms: 'Semoga Allah merahmatinya dan menempatkannya di dalam syurga.' },
    quiet: true
  },

  /* ---------- Other ---------- */
  {
    category: 'other', id: 'id-1', programme: [{ time: '19:00', label: { en: 'Registration', ms: 'Pendaftaran' } }, { time: '20:00', label: { en: 'Dinner', ms: 'Makan malam' } }, { time: '21:00', label: { en: 'Awards', ms: 'Anugerah' } }], gallery: 4, contacts: [{ name: 'Faizal (Sample)', role: { en: 'Organiser', ms: 'Penganjur' } }], name: { en: 'Ink Blue Dinner', ms: 'Makan Malam Biru Dakwat' },
    theme: { paper: '#F6F7FA', paper2: '#E9ECF3', ink: '#12203A', muted: '#46526B', accent: '#8A9BC4', accentText: '#2C4A8A',
      cover: '#1B2A4E', coverInk: '#EEF1F8', coverLine: '#9DB0DA', btn: '#1B2A4E', btnInk: '#F6F7FA', seal: '#9DB0DA', sealInk: '#12203A' },
    seal: 'wax', monogram: 'SC',
    cover: 'ticket',
    kicker: { en: 'Annual dinner', ms: 'Makan malam tahunan' },
    names: ['Sample Company'], subtitle: { en: 'Celebrating our year together', ms: 'Meraikan setahun bersama' }, guest: 'Encik Faizal',
    invite: { en: 'Sample Company invites you and a guest to an evening of dinner, awards and a look back at the year.', ms: 'Syarikat Contoh menjemput anda dan seorang tetamu ke malam makan malam, anugerah dan imbasan tahun ini.' },
    hosts: { en: ['From the management team'], ms: ['Daripada pihak pengurusan'] },
    events: [
      { label: { en: 'Annual dinner', ms: 'Makan malam tahunan' }, start: upcoming(5, 35, '19:00'), hours: 4,
        venue: { en: 'Sample Convention Hall', ms: 'Dewan Konvensyen Contoh' }, address: 'Jalan Contoh 20, 50490 Kuala Lumpur' }
    ],
    countdown: true,
    note: { en: 'Business attire. Please reply by the date in your email so we can plan the tables.', ms: 'Pakaian formal. Sila balas sebelum tarikh dalam e-mel supaya kami dapat susun meja.' },
    closing: { en: 'We look forward to seeing you.', ms: 'Kami menantikan kehadiran anda.' },
    quiet: false
  },
  {
    category: 'other', id: 'id-2', ...partyExtras(['11:00', '11:30', '12:30'], [{ en: 'Doa selamat', ms: 'Doa selamat' }, { en: 'Aqiqah', ms: 'Aqiqah' }, { en: 'Lunch', ms: 'Makan tengah hari' }], 4), name: { en: 'Dusty Blue Aqiqah', ms: 'Aqiqah Biru Debu' },
    theme: { paper: '#F4F7FA', paper2: '#E6EDF3', ink: '#1E2F40', muted: '#475A6C', accent: '#9DB4C8', accentText: '#33607F',
      cover: '#4A6A85', coverInk: '#F4F8FB', coverLine: '#C3D4E3', btn: '#33546F', btnInk: '#F4F7FA', seal: '#F4F8FB', sealInk: '#33546F' },
    seal: 'wax', monogram: 'A',
    cover: 'arch',
    kicker: { en: 'Aqiqah and doa selamat', ms: 'Majlis aqiqah dan doa selamat' },
    names: ['Adam'], subtitle: { en: 'Welcome to the world', ms: 'Selamat datang ke dunia' }, guest: 'Nenek Zawiyah',
    invite: { en: 'We are grateful for the arrival of our son. Please join us for the aqiqah and a doa of thanks.', ms: 'Kami bersyukur dengan kelahiran anak lelaki kami. Sila sertai majlis aqiqah dan doa kesyukuran.' },
    hosts: { en: ['Encik Hafiz and Puan Aina'], ms: ['Encik Hafiz dan Puan Aina'] },
    events: [
      { label: { en: 'Aqiqah and doa selamat', ms: 'Aqiqah dan doa selamat' }, start: upcoming(6, 18, '11:00'), hours: 3,
        venue: { en: 'Sample Residence', ms: 'Kediaman Contoh' }, address: 'No. 8, Jalan Contoh 3, 47500 Subang Jaya' }
    ],
    countdown: true, note: { en: 'Lunch will be served after the doa.', ms: 'Makan tengah hari disediakan selepas doa.' },
    closing: { en: 'Your prayers for our little one mean the world to us.', ms: 'Doa anda untuk si kecil sangat bermakna buat kami.' },
    quiet: false
  },
  {
    category: 'other', id: 'id-3', ...partyExtras(['11:00', '11:30', '12:30'], [{ en: 'Doa selamat', ms: 'Doa selamat' }, { en: 'Aqiqah and cukur jambul', ms: 'Aqiqah dan cukur jambul' }, { en: 'Lunch', ms: 'Makan tengah hari' }], 4), name: { en: 'Soft Pink Aqiqah', ms: 'Aqiqah Merah Jambu' },
    theme: { paper: '#FFF8F8', paper2: '#FBEAEC', ink: '#432B33', muted: '#6B4D56', accent: '#E7A9B4', accentText: '#9A3F55',
      cover: '#F9E1E5', coverInk: '#432B33', coverLine: '#C77A8C', btn: '#9A3F55', btnInk: '#FFF8F8', seal: '#9A3F55', sealInk: '#FFFFFF' },
    seal: 'wax', monogram: 'A', cover: 'oval',
    kicker: { en: 'Aqiqah and doa selamat', ms: 'Majlis aqiqah dan doa selamat' },
    names: ['Aisyah'], subtitle: { en: 'Our little princess', ms: 'Puteri kecil kami' }, guest: 'Nenek Mariam',
    invite: { en: 'With thanks to Allah for the arrival of our daughter, please join us for her aqiqah.', ms: 'Bersyukur ke hadrat Allah atas kelahiran puteri kami, sila sertai majlis aqiqahnya.' },
    hosts: { en: ['Encik Shamil and Puan Dahlia'], ms: ['Encik Shamil dan Puan Dahlia'] },
    events: [
      { label: { en: 'Aqiqah and doa selamat', ms: 'Aqiqah dan doa selamat' }, start: upcoming(6, 25, '11:00'), hours: 3,
        venue: { en: 'Sample Residence', ms: 'Kediaman Contoh' }, address: 'No. 5, Jalan Contoh 7, 47500 Subang Jaya' }
    ],
    countdown: true, note: { en: 'Lunch will be served after the doa.', ms: 'Makan tengah hari disediakan selepas doa.' },
    closing: { en: 'Your prayers for our little girl mean the world.', ms: 'Doa anda buat puteri kecil kami amat bermakna.' },
    quiet: false
  },
  {
    category: 'other', id: 'id-4', ...partyExtras(['10:00', '11:00', '13:00'], [{ en: 'Guests are seated', ms: 'Tetamu dijemput duduk' }, { en: 'Ceremony', ms: 'Majlis konvokesyen' }, { en: 'Lunch and photos', ms: 'Makan tengah hari dan bergambar' }], 4), name: { en: 'Graduation Day', ms: 'Hari Konvokesyen' },
    theme: { paper: '#FAFAF8', paper2: '#EFEFEA', ink: '#1B1B1B', muted: '#4F4F4A', accent: '#C2A45C', accentText: '#6F5412',
      cover: '#1B1B1B', coverInk: '#F5F2EA', coverLine: '#C2A45C', btn: '#1B1B1B', btnInk: '#FAFAF8', seal: '#C2A45C', sealInk: '#1B1B1B' },
    seal: 'wax', monogram: 'F', cover: 'modern',
    kicker: { en: 'Graduation celebration', ms: 'Meraikan konvokesyen' },
    names: ['Farah'], subtitle: { en: 'Bachelor of Science', ms: 'Ijazah Sarjana Muda Sains' }, guest: 'Pak Long Rashid',
    invite: { en: 'After years of hard work, Farah graduates. Join us to celebrate this milestone.', ms: 'Selepas bertahun berusaha, Farah bergraduat. Jom raikan pencapaian ini bersama.' },
    hosts: { en: ['From her family'], ms: ['Daripada keluarga'] },
    events: [
      { label: { en: 'Graduation ceremony', ms: 'Majlis konvokesyen' }, start: upcoming(6, 33, '10:00'), hours: 3,
        venue: { en: 'Sample University Hall', ms: 'Dewan Universiti Contoh' }, address: 'Jalan Contoh 1, 43600 Bangi' }
    ],
    countdown: true, note: { en: 'Please be seated 30 minutes before the ceremony.', ms: 'Sila duduk 30 minit sebelum majlis bermula.' },
    closing: { en: 'Thank you for being part of the journey.', ms: 'Terima kasih kerana bersama dalam perjalanan ini.' },
    quiet: false
  },
];

export const findDemo = (category: string, id: string): DemoInvite | undefined =>
  DEMOS.find((d) => d.category === category && d.id === id);

export const demosFor = (category: EventType): DemoInvite[] => DEMOS.filter((d) => d.category === category);

export const demoPath = (d: DemoInvite): string => `/${d.category}/${d.id}`;

export const mapsUrl = (e: DemoEvent, lang: Lang): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.venue[lang]}, ${e.address}`)}`;

export const wazeUrl = (e: DemoEvent, lang: Lang): string =>
  `https://waze.com/ul?q=${encodeURIComponent(`${e.venue[lang]}, ${e.address}`)}&navigate=yes`;

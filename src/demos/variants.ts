import type { DemoInvite, L } from './data';

/* Per-design interior copy. The shared builders in data.ts and more.ts give every design of a category the same story,
   programme labels, closing, note and gift. Here each design picks its own from pools, using independent moduli so no two
   designs in a category end up with the same combination (7 x 5 x 4 x 3 > 100). Everything is invented sample text.
   Categories whose rows already carry their own copy (other, graduation, anniversary, corporate, festive, funeral) are untouched. */

const l = (en: string, ms: string): L => ({ en, ms });
const num = (d: DemoInvite): number => parseInt(d.id.replace(/\D/g, ''), 10) || 1;
const pick = <T,>(pool: T[], n: number): T => pool[((n % pool.length) + pool.length) % pool.length];

type Chapter = { when: L; title: L; text: L };
const story = (a: string, d: string): Chapter[][] => [
  [
    { when: l('2019', '2019'), title: l('How we met', 'Bagaimana kami bertemu'), text: l(`A friend introduced ${a} and ${d} at a book club. They talked until the cafe closed.`, `Seorang rakan memperkenalkan ${a} dan ${d} di kelab buku. Mereka berbual sehingga kafe tutup.`) },
    { when: l('2022', '2022'), title: l('The proposal', 'Lamaran'), text: l(`On a quiet evening walk, ${d} asked the question. ${a} said yes before the sentence ended.`, `Pada satu petang yang tenang, ${d} bertanya soalan itu. ${a} berkata ya sebelum ayat habis.`) },
    { when: l('Today', 'Hari ini'), title: l('Two families, one celebration', 'Dua keluarga, satu perayaan'), text: l('We would love you to be part of the day we become one family.', 'Kami ingin anda menjadi sebahagian daripada hari kami menjadi satu keluarga.') }
  ],
  [
    { when: l('A rainy Tuesday', 'Selasa yang hujan'), title: l('Coffee for two', 'Kopi untuk dua'), text: l(`${d} shared an umbrella with a stranger. The stranger was ${a}, and the coffee lasted three hours.`, `${d} berkongsi payung dengan seorang asing. Orang itu ${a}, dan kopi itu berlarutan tiga jam.`) },
    { when: l('Two years apart', 'Dua tahun berjauhan'), title: l('The long distance', 'Jarak yang jauh'), text: l('Late-night calls, a lot of boarding passes and one promise to close the gap.', 'Panggilan lewat malam, banyak tiket penerbangan dan satu janji untuk mendekatkan jarak.') },
    { when: l('This year', 'Tahun ini'), title: l('Our promise', 'Janji kami'), text: l('Now the journey continues side by side. Come and share the first day of it.', 'Kini perjalanan diteruskan bersama. Datanglah berkongsi hari pertamanya.') }
  ],
  [
    { when: l('Childhood', 'Zaman kanak-kanak'), title: l('Same kampung, different school', 'Sekampung, lain sekolah'), text: l(`${a} and ${d} grew up two lanes apart and never met until a cousin's wedding.`, `${a} dan ${d} membesar dua lorong berjauhan dan tidak pernah bertemu sehinggalah kenduri sepupu.`) },
    { when: l('Last year', 'Tahun lalu'), title: l('A little matchmaking', 'Sedikit perantaraan'), text: l('Two grandmothers, one plate of kuih and a lot of hints. The families took it from there.', 'Dua nenek, sepinggan kuih dan banyak isyarat. Keluarga menyambung selebihnya.') },
    { when: l('The day', 'Hari bahagia'), title: l('The yes', 'Ya yang dinanti'), text: l('We are grateful to everyone who prayed for us. Join us as we say it together.', 'Kami bersyukur atas doa semua. Sertai kami ketika kami melafazkannya bersama.') }
  ],
  [
    { when: l('2018', '2018'), title: l('Colleagues', 'Rakan sekerja'), text: l(`${a} and ${d} shared a desk, a deadline and far too many lunches.`, `${a} dan ${d} berkongsi meja, tarikh akhir dan terlalu banyak makan tengah hari.`) },
    { when: l('2023', '2023'), title: l('The surprise trip', 'Percutian kejutan'), text: l(`${d} planned a weekend by the sea. The ring was hidden in the picnic basket.`, `${d} merancang hujung minggu di tepi laut. Cincin disembunyikan dalam bakul piknik.`) },
    { when: l('Soon', 'Tidak lama lagi'), title: l('Forever starts', 'Selamanya bermula'), text: l('Help us begin it with a good meal and good company.', 'Bantu kami memulakannya dengan jamuan dan bersama orang tersayang.') }
  ],
  [
    { when: l('A wrong number', 'Nombor salah'), title: l('Hello, who is this?', 'Helo, siapa ini?'), text: l(`A message meant for someone else reached ${a}. ${d} apologised, and kept writing.`, `Satu mesej untuk orang lain sampai kepada ${a}. ${d} memohon maaf, lalu terus menulis.`) },
    { when: l('First trip', 'Perjalanan pertama'), title: l('Lost and happy', 'Sesat tetapi gembira'), text: l('A missed turn, a village stall and the best nasi lemak either of them had eaten.', 'Tersilap simpang, sebuah gerai kampung dan nasi lemak paling sedap yang pernah mereka makan.') },
    { when: l('Together', 'Bersama'), title: l('Always', 'Selamanya'), text: l('The map ends here, but the road goes on. Walk the first steps of it with us.', 'Peta berakhir di sini, tetapi jalan berterusan. Lalui langkah pertamanya bersama kami.') }
  ],
  [
    { when: l('Next door', 'Jiran sebelah'), title: l('Neighbours', 'Berjiran'), text: l(`${a} lent ${d}'s family a ladder in 2015. It was never quite returned.`, `${a} meminjamkan keluarga ${d} sebuah tangga pada 2015. Ia tidak pernah benar-benar dipulangkan.`) },
    { when: l('Hari Raya', 'Hari Raya'), title: l('The visit', 'Kunjungan'), text: l('A raya visit became a long chat on the porch, then a long chat every day.', 'Kunjungan raya menjadi sembang panjang di beranda, kemudian sembang panjang setiap hari.') },
    { when: l('Now', 'Kini'), title: l('One home', 'Satu rumah'), text: l('Two homes become one, and the ladder finally goes back.', 'Dua rumah menjadi satu, dan tangga akhirnya dipulangkan.') }
  ],
  [
    { when: l('Orientation week', 'Minggu orientasi'), title: l('First hello', 'Sapaan pertama'), text: l(`${a} lost the way to the lecture hall. ${d} had the map and a spare pen.`, `${a} sesat ke dewan kuliah. ${d} ada peta dan sebatang pen lebih.`) },
    { when: l('Final year', 'Tahun akhir'), title: l('Exam-night friends', 'Teman malam peperiksaan'), text: l('Flashcards, instant noodles and a promise to celebrate when it was all over.', 'Kad imbas, mi segera dan janji untuk meraikan apabila semuanya selesai.') },
    { when: l('Graduation, again', 'Graduasi, sekali lagi'), title: l('The ring', 'Cincin'), text: l('The celebration is finally here, with a little more cake than planned.', 'Sambutan itu akhirnya tiba, dengan lebih banyak kek daripada yang dirancang.') }
  ]
];

type Style = 'malay' | 'chinese' | 'indian' | 'neutral';
const styleOf = (d: DemoInvite): Style => {
  const x = d.events[0].label.en;
  return x === 'Akad nikah' ? 'malay' : x === 'Tea ceremony' ? 'chinese' : x === 'Wedding ceremony' ? 'indian' : 'neutral';
};

const WED_PROG: Record<Style, L[][]> = {
  malay: [
    [l('Guests arrive', 'Ketibaan tetamu'), l('Arrival of the couple', 'Ketibaan pengantin'), l('Dinner is served', 'Jamuan makan'), l('Cake cutting', 'Pemotongan kek'), l('Photos with family', 'Sesi bergambar bersama keluarga')],
    [l('Doa and marhaban', 'Doa dan marhaban'), l('Bersanding', 'Majlis bersanding'), l('Lunch is served', 'Jamuan tengah hari'), l('Kompang and silat', 'Kompang dan silat'), l('Family portraits', 'Gambar keluarga')],
    [l('Registration', 'Pendaftaran tetamu'), l('Welcome speech', 'Ucapan alu-aluan'), l('Bersanding', 'Majlis bersanding'), l('Feast and music', 'Jamuan dan muzik'), l('Farewell and doa', 'Doa selamat dan bersurai')]
  ],
  chinese: [
    [l('Guests arrive', 'Ketibaan tetamu'), l('Arrival of the couple', 'Ketibaan pengantin'), l('Dinner is served', 'Jamuan makan'), l('Cake cutting', 'Pemotongan kek'), l('Photos with family', 'Sesi bergambar bersama keluarga')],
    [l('Door games', 'Permainan pintu'), l('Tea ceremony', 'Majlis minum teh'), l('Banquet begins', 'Jamuan bermula'), l('Yum seng toast', 'Ucapan yum seng'), l('Farewell at the door', 'Ucapan selamat tinggal')]
  ],
  indian: [
    [l('Guests arrive', 'Ketibaan tetamu'), l('Arrival of the couple', 'Ketibaan pengantin'), l('Dinner is served', 'Jamuan makan'), l('Cake cutting', 'Pemotongan kek'), l('Photos with family', 'Sesi bergambar bersama keluarga')],
    [l('Baraat procession', 'Perarakan baraat'), l('Garland exchange', 'Pertukaran kalungan bunga'), l('Ceremony at the mandap', 'Upacara di mandap'), l('Banana leaf feast', 'Jamuan daun pisang'), l('Blessings and photos', 'Restu dan bergambar')]
  ],
  neutral: [
    [l('Guests arrive', 'Ketibaan tetamu'), l('Arrival of the couple', 'Ketibaan pengantin'), l('Dinner is served', 'Jamuan makan'), l('Cake cutting', 'Pemotongan kek'), l('Photos with family', 'Sesi bergambar bersama keluarga')],
    [l('Welcome drinks', 'Minuman alu-aluan'), l('Vows', 'Lafaz janji'), l('Dinner is served', 'Jamuan makan'), l('First dance', 'Tarian pertama'), l('Toast and cake', 'Ucapan dan kek')],
    [l('Seating', 'Menempatkan tetamu'), l('Ceremony', 'Majlis akad'), l('Cocktail hour', 'Waktu koktel'), l('Dinner and speeches', 'Makan malam dan ucapan'), l('Dancing', 'Menari')]
  ]
};

const CLOSING_MALAY: L[] = [
  l('Your presence and your prayers are the best gift we could receive. May Allah bless this union.', 'Kehadiran dan doa anda adalah hadiah terindah buat kami. Semoga Allah memberkati perkahwinan ini.'),
  l('We ask for your doa as we begin this journey. Thank you for being part of it.', 'Kami memohon doa anda ketika memulakan perjalanan ini. Terima kasih kerana menjadi sebahagiannya.'),
  l('May this day be the start of a home full of love, calm and mercy.', 'Semoga hari ini permulaan sebuah rumah tangga penuh kasih, tenang dan rahmat.'),
  l('Thank you for coming from near and far. Your smile is our blessing.', 'Terima kasih kerana hadir dari dekat dan jauh. Senyuman anda adalah restu buat kami.')
];
const CLOSING_OTHER: L[] = [
  l('Your presence is the best gift we could receive. Thank you for celebrating with us.', 'Kehadiran anda adalah hadiah terindah buat kami. Terima kasih kerana meraikan bersama.'),
  l('Good food, good people and a very happy ending. We cannot wait to see you.', 'Makanan yang enak, orang tersayang dan penghujung yang bahagia. Kami menanti kehadiran anda.'),
  l('Thank you for sharing the happiest day of our lives with us.', 'Terima kasih kerana berkongsi hari paling bahagia dalam hidup kami.'),
  l('Dress up, dance a little and stay for the cake.', 'Berpakaian cantik, menari sedikit dan tinggal untuk kek.')
];

const WED_NOTES: L[] = [
  l('Parking is free behind the hall. A prayer room (surau) is on the ground floor.', 'Tempat letak kereta percuma di belakang dewan. Surau disediakan di tingkat bawah.'),
  l('Dress code: pastel or earth tones. Please arrive 15 minutes early.', 'Kod pakaian: warna pastel atau warna bumi. Sila tiba 15 minit lebih awal.'),
  l('Valet is at the main lobby. Shuttle from the LRT station every 20 minutes.', 'Valet di lobi utama. Bas ulang-alik dari stesen LRT setiap 20 minit.'),
  l('Children are warmly welcome. A kids corner is set up beside the buffet.', 'Kanak-kanak dialu-alukan. Sudut kanak-kanak disediakan di sebelah bufet.'),
  l('The garden is outdoors and shaded. Flat shoes are recommended.', 'Taman ini di luar dan teduh. Kasut rata disyorkan.')
];

const BANKS: Array<[L, string]> = [
  [l('Sample Bank', 'Bank Contoh'), '0000 1111 2222'],
  [l('Demo Islamic Bank', 'Bank Islam Demo'), '1234 5678 0001'],
  [l('Example Savings Bank', 'Bank Simpanan Contoh'), '9000 4567 8800'],
  [l('Specimen Bank Berhad', 'Bank Spesimen Berhad'), '5500 2200 7711']
];

/* kid and adult birthday programmes by design id (3 lines each, EN | MS) */
const BDAY_PROG: Record<number, [string, string, string]> = {
  1: ['Welcome and games|Alu-aluan dan permainan', 'Cake and singing|Kek dan nyanyian', 'Goodie bags|Beg cenderahati'],
  3: ['Face painting|Lukisan muka', 'Balloon show|Persembahan belon', 'Cake and goodie bags|Kek dan beg cenderahati'],
  5: ['Unicorn crafts|Kraf unicorn', 'Magic show|Persembahan silap mata', 'Cake and rainbow juice|Kek dan jus pelangi'],
  6: ['Fossil dig|Mencari fosil', 'Roar contest|Pertandingan mengaum', 'Cake and prizes|Kek dan hadiah'],
  7: ['Build a rocket|Membina roket', 'Countdown and cake|Kiraan detik dan kek', 'Star gazing|Melihat bintang'],
  8: ['Tea party|Majlis teh', 'Crown decorating|Menghias mahkota', 'Cake and dance|Kek dan tarian'],
  9: ['Hero training course|Latihan wira', 'Cape and mask photos|Bergambar dengan jubah', 'Cake and prizes|Kek dan hadiah'],
  10: ['Treasure hunt|Memburu harta karun', 'Sea-creature crafts|Kraf hidupan laut', 'Cake and bubbles|Kek dan buih sabun'],
  11: ['Penalty shootout|Sepak penalti', 'Mini match|Perlawanan mini', 'Cake and medals|Kek dan pingat'],
  12: ['Animal masks|Topeng haiwan', 'Safari scavenger hunt|Pencarian safari', 'Cake and snacks|Kek dan snek'],
  13: ['Picnic and blankets|Piknik dan hamparan', 'Storytime|Waktu bercerita', 'Cake and teddy gifts|Kek dan hadiah teddy'],
  14: ['Flower crowns|Mahkota bunga', 'Craft table|Meja kraf', 'Cake and lemonade|Kek dan limau'],
  15: ['Welcome mocktails|Mocktail alu-aluan', 'Dinner|Makan malam', 'Photo booth and cake|Photo booth dan kek'],
  16: ['Cocktail hour|Waktu koktel', 'Dinner and speeches|Makan malam dan ucapan', 'Cake and live music|Kek dan muzik langsung'],
  17: ['Welcome drinks|Minuman alu-aluan', 'Luau buffet|Bufet luau', 'Limbo and cake|Limbo dan kek'],
  18: ['Welcome drinks|Minuman alu-aluan', 'Dinner|Makan malam', 'Disco and cake|Disko dan kek'],
  19: ['Mingle and canapes|Bersantai dan kanape', 'Dinner|Makan malam', 'Toast and cake|Ucapan dan kek'],
  20: ['Go-kart rides|Menunggang go-kart', 'Pit stop snacks|Snek pit stop', 'Cake and trophies|Kek dan trofi']
};
const BDAY_CLOSING: L[] = [
  l('Thank you for making the day special.', 'Terima kasih kerana meraikan hari istimewa ini.'),
  l('See you at the party. Wear something comfortable and bring your appetite.', 'Jumpa di majlis nanti. Pakai yang selesa dan bawa selera makan.'),
  l('Every year is a gift. Thank you for sharing this one.', 'Setiap tahun adalah anugerah. Terima kasih berkongsi tahun ini.'),
  l('Your presence is the only gift we need.', 'Kehadiran anda adalah satu-satunya hadiah yang kami perlukan.')
];

const BABY_NOTES: L[] = [
  l('Parking is on the street in front of the house. Gifts are welcome but never expected.', 'Tempat letak kereta di bahu jalan depan rumah. Hadiah dialu-alukan tetapi tidak diwajibkan.'),
  l('Please come hungry. Lunch is served right after the doa.', 'Datanglah dengan perut kosong. Makan tengah hari dihidangkan selepas doa.'),
  l('The baby naps at noon, so we will keep things gentle and quiet.', 'Si kecil tidur tengah hari, jadi suasana akan dijaga lembut dan tenang.')
];

const ENG_PROG_MALAY: L[] = [l('Doa and tahlil', 'Doa dan tahlil'), l('Exchange of rings', 'Upacara sarung cincin')];

export function vary(d: DemoInvite): DemoInvite {
  const n = num(d);
  if (d.category === 'wedding' || d.category === 'engagement') {
    const [a, b] = d.names;
    const next: DemoInvite = { ...d };
    if (d.story) next.story = pick(story(a, b ?? a), n);
    if (d.category === 'wedding') {
      const st = styleOf(d);
      if (d.programme) {
        const labels = pick(WED_PROG[st], n + 1);
        next.programme = d.programme.map((p, i) => ({ time: p.time, label: labels[i] ?? p.label }));
      }
      next.closing = pick(st === 'malay' ? CLOSING_MALAY : CLOSING_OTHER, n * 3 + 1);
      next.note = pick(WED_NOTES, n * 2 + 1);
      if (d.gift) {
        const [bank, account] = pick(BANKS, n);
        next.gift = { ...d.gift, bank, account };
      }
    } else if (d.programme && !d.programme.some((p) => /welcome toast/i.test(p.label.en))) {
      next.programme = d.programme.map((p, i) => (n % 2 === 0 && i === 0 ? { ...p, label: ENG_PROG_MALAY[0] } : p));
    }
    return next;
  }
  if (d.category === 'birthday') {
    const pr = BDAY_PROG[n];
    const next: DemoInvite = { ...d, closing: pick(BDAY_CLOSING, n) };
    if (pr && d.programme) {
      next.programme = d.programme.map((p, i) => {
        const [en, ms] = (pr[i] ?? '|').split('|');
        return en ? { time: p.time, label: l(en, ms ?? en) } : p;
      });
    }
    return next;
  }
  if (d.category === 'baby') return { ...d, note: pick(BABY_NOTES, n) };
  return d;
}

// Run: npm test
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// .gs is not a known extension for require(), so load the file as plain JS.
const mod = { exports: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../apps-script/Code.gs'), 'utf8'), { module: mod, console });
const c = mod.exports;

let n = 0;
const t = (name, fn) => { fn(); n++; console.log('ok -', name); };
const today = '2026-11-03';
const good = { name: 'Aisyah', phone: '012-345 6789', eventType: 'wedding', eventDate: '2026-12-20', note: 'hi', lang: 'ms' };

t('sanitizeCell prefixes formula starters', () => {
  assert.strictEqual(c.sanitizeCell_('=HYPERLINK("x")'), "'=HYPERLINK(\"x\")");
  assert.strictEqual(c.sanitizeCell_('+60'), "'+60");
  assert.strictEqual(c.sanitizeCell_('-1'), "'-1");
  assert.strictEqual(c.sanitizeCell_('@a'), "'@a");
  assert.strictEqual(c.sanitizeCell_('  Ali  '), 'Ali');
  assert.strictEqual(c.sanitizeCell_(null), '');
});

t('normalizePhone', () => {
  assert.strictEqual(c.normalizePhone_('012-345 6789'), '60123456789');
  assert.strictEqual(c.normalizePhone_('+60 12-345 6789'), '60123456789');
  assert.strictEqual(c.normalizePhone_('123'), '');
  assert.strictEqual(c.normalizePhone_('abc'), '');
  assert.strictEqual(c.normalizePhone_('1'.repeat(16)), '');
});

t('isValidDate', () => {
  assert.ok(c.isValidDate_('2026-12-20'));
  assert.ok(!c.isValidDate_('2026-02-30'));
  assert.ok(!c.isValidDate_('20-12-2026'));
});

t('enabledTypes defaults hide funeral', () => {
  assert.strictEqual(JSON.stringify(c.enabledTypes_({})), '["wedding","birthday","other"]');
  assert.strictEqual(JSON.stringify(c.enabledTypes_({ show_funeral: 'TRUE', show_other: false })), '["wedding","birthday","funeral"]');
});

t('publicConfig is a whitelist and never leaks notify_email', () => {
  const out = c.publicConfig_({ brand_name: 'X', notify_email: 'boss@x.com', secret: 's', whatsapp_number: '+60 12-345 6789', show_funeral: 'TRUE' });
  assert.strictEqual(out.notify_email, undefined);
  assert.strictEqual(out.secret, undefined);
  assert.strictEqual(out.whatsapp_number, '60123456789');
  assert.strictEqual(out.show_funeral, true);
  assert.strictEqual(out.booking_open, true);
  assert.strictEqual(c.publicConfig_({ whatsapp_number: '12' }).whatsapp_number, '');
  const d = c.publicConfig_({ demo_wedding_url: ' https://x.com/w ', demo_url: 'https://old.com' });
  assert.strictEqual(d.demo_wedding_url, 'https://x.com/w');
  assert.strictEqual(d.demo_birthday_url, '');
  assert.strictEqual(d.demo_url, undefined);
});

t('validateBooking accepts a good booking', () => {
  const r = c.validateBooking_(good, {}, today);
  assert.ok(r.ok);
  assert.strictEqual(r.value.phone, '60123456789');
  assert.strictEqual(r.value.lang, 'ms');
});

t('validateBooking rejects bad input', () => {
  const bad = (patch, cfg) => assert.ok(!c.validateBooking_(Object.assign({}, good, patch), cfg || {}, today).ok);
  bad({ name: '' });
  bad({ name: 'a'.repeat(81) });
  bad({ phone: '12' });
  bad({ eventType: 'party' });
  bad({ eventType: 'funeral' }); // hidden by default
  bad({ eventDate: '2026-11-02' }); // past
  bad({ eventDate: 'tomorrow' });
  bad({ note: 'n'.repeat(301) });
  assert.ok(c.validateBooking_(Object.assign({}, good, { eventType: 'funeral' }), { show_funeral: 'TRUE' }, today).ok);
});

t('validateBooking allows empty date and unknown lang falls back to en', () => {
  const r = c.validateBooking_(Object.assign({}, good, { eventDate: '', lang: 'xx' }), {}, today);
  assert.ok(r.ok);
  assert.strictEqual(r.value.lang, 'en');
});

t('overLimit per phone and per day', () => {
  const row = (d, p) => [d + ' 10:00:00', 'n', p];
  const three = [row(today, '60123456789'), row(today, '60123456789'), row(today, '60123456789')];
  assert.ok(c.overLimit_(three, '60123456789', today));
  assert.ok(!c.overLimit_(three, '60199999999', today));
  assert.ok(!c.overLimit_([row('2026-11-02', '60123456789'), row('2026-11-02', '60123456789'), row('2026-11-02', '60123456789')], '60123456789', today));
  const many = Array.from({ length: 100 }, (_, i) => row(today, '6011' + String(i).padStart(7, '0')));
  assert.ok(c.overLimit_(many, '60199999999', today));
});

console.log(`\n${n} tests passed`);

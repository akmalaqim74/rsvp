/* Landing page backend: serves public Config and saves bookings into the Sheet.
   Paste into Extensions > Apps Script of the Sheet. Deploy as Web app (Execute as: Me, Access: Anyone). */

var TAB_CONFIG = 'Config';
var TAB_BOOKINGS = 'Bookings';
var TZ = 'Asia/Kuala_Lumpur';
var MAX_PER_PHONE_PER_DAY = 3;
var MAX_PER_DAY = 100;
var EVENT_TYPES = ['wedding', 'engagement', 'aqiqah', 'birthday', 'funeral', 'other'];
var EVENT_DEFAULTS = { wedding: true, engagement: true, aqiqah: true, birthday: true, funeral: false, other: true };
var PUBLIC_TEXT_KEYS = ['brand_name', 'logo_url', 'whatsapp_msg_en', 'whatsapp_msg_ms', 'contact_email'];
var BOOKING_HEADERS = ['timestamp', 'name', 'phone', 'event_type', 'event_date', 'note', 'lang', 'status'];

/* ---------- pure helpers (unit tested in tests/apps-script.test.js) ---------- */

function toBool_(value, fallback) {
  if (value === true || value === false) return value;
  var s = String(value === undefined || value === null ? '' : value).trim().toUpperCase();
  if (s === 'TRUE') return true;
  if (s === 'FALSE') return false;
  return fallback;
}

function sanitizeCell_(value) {
  var s = String(value === undefined || value === null ? '' : value).replace(/[\u0000-\u001f]/g, ' ').trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function normalizePhone_(value) {
  var d = String(value === undefined || value === null ? '' : value).replace(/\D/g, '');
  if (/^0\d{9,10}$/.test(d)) d = '6' + d; // Malaysian local format 01x... to 601x...
  return d.length >= 9 && d.length <= 15 ? d : '';
}

function enabledTypes_(cfg) {
  return EVENT_TYPES.filter(function (t) { return toBool_(cfg['show_' + t], EVENT_DEFAULTS[t]); });
}

function isValidDate_(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  var p = s.split('-');
  var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  return d.getUTCFullYear() === +p[0] && d.getUTCMonth() === +p[1] - 1 && d.getUTCDate() === +p[2];
}

/* Whitelist only. notify_email and anything unknown is never returned. */
function publicConfig_(cfg) {
  var out = {};
  PUBLIC_TEXT_KEYS.forEach(function (k) { out[k] = String(cfg[k] === undefined ? '' : cfg[k]).trim(); });
  var wa = String(cfg.whatsapp_number === undefined ? '' : cfg.whatsapp_number).replace(/\D/g, '');
  out.whatsapp_number = wa.length >= 9 && wa.length <= 15 ? wa : '';
  EVENT_TYPES.forEach(function (t) { out['show_' + t] = toBool_(cfg['show_' + t], EVENT_DEFAULTS[t]); });
  out.booking_open = toBool_(cfg.booking_open, true);
  return out;
}

/* body: parsed JSON from the client. today: 'yyyy-MM-dd' in Asia/Kuala_Lumpur. */
function validateBooking_(body, cfg, today) {
  var name = String(body.name === undefined || body.name === null ? '' : body.name).trim();
  if (name.length < 1 || name.length > 80) return { ok: false, message: 'Please enter your name' };
  var phone = normalizePhone_(body.phone);
  if (!phone) return { ok: false, message: 'Please enter a valid phone number' };
  var type = String(body.eventType || '');
  if (enabledTypes_(cfg).indexOf(type) === -1) return { ok: false, message: 'Please choose a type of event' };
  var date = String(body.eventDate || '').trim();
  if (date && (!isValidDate_(date) || date < today)) return { ok: false, message: 'Please enter a valid future date' };
  var note = String(body.note === undefined || body.note === null ? '' : body.note).trim();
  if (note.length > 300) return { ok: false, message: 'Note is too long' };
  var lang = body.lang === 'ms' ? 'ms' : 'en';
  return { ok: true, value: { name: name, phone: phone, eventType: type, eventDate: date, note: note, lang: lang } };
}

/* rows: recent Bookings rows as arrays [timestamp, name, phone, ...]. */
function overLimit_(rows, phone, today) {
  var total = 0, same = 0;
  rows.forEach(function (r) {
    if (String(r[0]).indexOf(today) !== 0) return;
    total++;
    if (String(r[2]).replace(/\D/g, '') === phone) same++;
  });
  return total >= MAX_PER_DAY || same >= MAX_PER_PHONE_PER_DAY;
}

/* ---------- Apps Script entry points ---------- */

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function readConfig_() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(TAB_CONFIG);
  var cfg = {};
  if (!sheet) return cfg;
  sheet.getDataRange().getValues().forEach(function (row, i) {
    if (i === 0) return;
    var key = String(row[0]).trim();
    if (key) cfg[key] = row[1];
  });
  return cfg;
}

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : '';
  if (action === 'config') {
    return jsonOut_({ status: true, message: 'OK', data: publicConfig_(readConfig_()) });
  }
  return jsonOut_({ status: false, message: 'Not found' });
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return jsonOut_({ status: false, message: 'Bad request' }); }
  if (!body || body.action !== 'booking') return jsonOut_({ status: false, message: 'Bad request' });

  var cfg = readConfig_();
  if (!toBool_(cfg.booking_open, true)) return jsonOut_({ status: false, message: 'Bookings are closed. Please WhatsApp us.' });
  if (body.website) return jsonOut_({ status: true, message: 'Booking received' }); // honeypot: pretend success

  var now = new Date();
  var today = Utilities.formatDate(now, TZ, 'yyyy-MM-dd');
  var v = validateBooking_(body, cfg, today);
  if (!v.ok) return jsonOut_({ status: false, message: v.message });

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return jsonOut_({ status: false, message: 'Busy, please try again' });
  try {
    var sheet = SpreadsheetApp.getActive().getSheetByName(TAB_BOOKINGS);
    if (!sheet) return jsonOut_({ status: false, message: 'Please WhatsApp us instead.' });
    var last = sheet.getLastRow();
    var from = Math.max(2, last - 299);
    var recent = last >= 2 ? sheet.getRange(from, 1, last - from + 1, 3).getDisplayValues() : [];
    if (overLimit_(recent, v.value.phone, today)) return jsonOut_({ status: false, message: 'Please WhatsApp us instead.' });
    var x = v.value;
    sheet.appendRow([
      Utilities.formatDate(now, TZ, 'yyyy-MM-dd HH:mm:ss'),
      sanitizeCell_(x.name), x.phone, x.eventType, x.eventDate, sanitizeCell_(x.note), x.lang, 'new'
    ]);
  } finally {
    lock.releaseLock();
  }

  var notify = String(cfg.notify_email || '').trim();
  if (notify) {
    try {
      MailApp.sendEmail(notify, 'New booking: ' + sanitizeCell_(v.value.name),
        'Name: ' + v.value.name + '\nPhone: ' + v.value.phone + '\nEvent: ' + v.value.eventType + '\nDate: ' + v.value.eventDate);
    } catch (err) { /* email failure must not fail the booking */ }
  }
  return jsonOut_({ status: true, message: 'Booking received' });
}

/* ---------- Sheet menu ---------- */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Landing tools')
    .addItem('Set up tabs (first time)', 'setupTabs')
    .addItem('Check setup', 'selfTest')
    .addToUi();
}

function setupTabs() {
  var ss = SpreadsheetApp.getActive();
  var cfg = ss.getSheetByName(TAB_CONFIG) || ss.insertSheet(TAB_CONFIG);
  if (cfg.getLastRow() === 0) {
    var rows = [['key', 'value'],
      ['brand_name', 'Your brand'], ['logo_url', ''], ['whatsapp_number', ''],
      ['whatsapp_msg_en', 'Hi, I would like to book an RSVP invitation.'],
      ['whatsapp_msg_ms', 'Hai, saya ingin tempah jemputan RSVP.'],
      ['contact_email', ''],
      ['show_wedding', 'TRUE'], ['show_engagement', 'TRUE'], ['show_aqiqah', 'TRUE'], ['show_birthday', 'TRUE'], ['show_funeral', 'FALSE'], ['show_other', 'TRUE'],
      ['booking_open', 'TRUE'], ['notify_email', '']];
    cfg.getRange(1, 1, rows.length, 2).setValues(rows);
    cfg.getRange('B:B').setNumberFormat('@');
  }
  var b = ss.getSheetByName(TAB_BOOKINGS) || ss.insertSheet(TAB_BOOKINGS);
  if (b.getLastRow() === 0) {
    b.getRange(1, 1, 1, BOOKING_HEADERS.length).setValues([BOOKING_HEADERS]);
    b.getRange('C:C').setNumberFormat('@');
    b.setFrozenRows(1);
  }
  SpreadsheetApp.getUi().alert('Tabs are ready. Now fill in the Config tab.');
}

function selfTest() {
  var problems = [];
  var ss = SpreadsheetApp.getActive();
  if (!ss.getSheetByName(TAB_CONFIG)) problems.push('Config tab is missing');
  var b = ss.getSheetByName(TAB_BOOKINGS);
  if (!b) problems.push('Bookings tab is missing');
  else if (b.getRange(1, 1, 1, BOOKING_HEADERS.length).getValues()[0].join() !== BOOKING_HEADERS.join()) problems.push('Bookings header row is wrong');
  var pub = publicConfig_(readConfig_());
  if (!pub.whatsapp_number) problems.push('whatsapp_number is empty or not 9 to 15 digits');
  if (!pub.brand_name) problems.push('brand_name is empty');
  if (!enabledTypes_(readConfig_()).length) problems.push('All event types are switched off');
  SpreadsheetApp.getUi().alert(problems.length ? 'Problems:\n- ' + problems.join('\n- ') : 'Setup looks good.');
}

if (typeof module !== 'undefined') {
  module.exports = { toBool_: toBool_, sanitizeCell_: sanitizeCell_, normalizePhone_: normalizePhone_, enabledTypes_: enabledTypes_,
    isValidDate_: isValidDate_, publicConfig_: publicConfig_, validateBooking_: validateBooking_, overLimit_: overLimit_ };
}

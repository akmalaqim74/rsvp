(function () {
  'use strict';

  var SITE = window.SITE;
  var TYPES = ['wedding', 'birthday', 'funeral', 'other'];
  var LANGS = ['ms', 'en'];
  var CACHE_KEY = 'rsvp_cfg_v1';
  var LANG_KEY = 'rsvp_lang';

  // Local-only mock so the page can be checked without a deployed script: http://localhost:PORT/?mock=1 (or mock=fail)
  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var mock = isLocal ? new URLSearchParams(location.search).get('mock') : null;

  var state = { lang: 'en', strings: {}, fallback: {}, config: SITE.config };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function t(key) { return state.strings[key] || state.fallback[key] || key; }

  function store(fn) { try { return fn(); } catch (e) { return null; } } // storage can be blocked

  /* ---------- i18n ---------- */

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) { return r.json(); });
  }

  function detectLang() {
    var saved = store(function () { return localStorage.getItem(LANG_KEY); });
    if (LANGS.indexOf(saved) !== -1) return saved;
    return /^ms/i.test(navigator.language || '') ? 'ms' : 'en';
  }

  function setLang(lang) {
    state.lang = lang;
    store(function () { localStorage.setItem(LANG_KEY, lang); });
    return fetchJson('i18n/' + lang + '.json').then(function (s) {
      state.strings = s;
      renderText();
    });
  }

  function renderText() {
    document.documentElement.lang = state.lang;
    document.title = t('meta.title');
    $all('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $all('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === state.lang)); });
    renderTypeOptions();
    renderWhatsApp();
  }

  /* ---------- config ---------- */

  function isHttps(u) { return /^https:\/\//i.test(u || ''); }

  function normalizeConfig(raw) {
    var d = SITE.config, c = {};
    ['brand_name', 'logo_url', 'whatsapp_msg_en', 'whatsapp_msg_ms', 'contact_email', 'demo_url'].forEach(function (k) {
      c[k] = typeof raw[k] === 'string' ? raw[k].trim() : d[k];
    });
    c.brand_name = c.brand_name || d.brand_name;
    if (!isHttps(c.logo_url)) c.logo_url = '';
    if (!isHttps(c.demo_url)) c.demo_url = '';
    var wa = String(raw.whatsapp_number || '').replace(/\D/g, '');
    c.whatsapp_number = wa.length >= 9 && wa.length <= 15 ? wa : '';
    TYPES.forEach(function (ty) { c['show_' + ty] = typeof raw['show_' + ty] === 'boolean' ? raw['show_' + ty] : d['show_' + ty]; });
    c.booking_open = typeof raw.booking_open === 'boolean' ? raw.booking_open : true;
    return c;
  }

  function loadConfig() {
    if (mock) {
      return Promise.resolve({
        brand_name: 'Sample Brand', whatsapp_number: '60123456789', whatsapp_msg_en: 'Hi, I want to book.',
        whatsapp_msg_ms: 'Hai, saya nak tempah.', contact_email: 'hello@example.com', demo_url: 'https://example.com/demo',
        show_wedding: true, show_birthday: true, show_funeral: mock === 'funeral', show_other: true, booking_open: mock !== 'closed'
      });
    }
    if (!SITE.scriptUrl) return Promise.reject(new Error('no script url'));
    var cached = store(function () { return JSON.parse(sessionStorage.getItem(CACHE_KEY)); });
    if (cached && Date.now() - cached.at < SITE.cacheMinutes * 60000) return Promise.resolve(cached.data);

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, SITE.configTimeoutMs);
    var url = SITE.scriptUrl + (SITE.scriptUrl.indexOf('?') === -1 ? '?' : '&') + 'action=config&_t=' + Date.now();
    return fetch(url, { cache: 'no-store', signal: ctrl.signal })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        clearTimeout(timer);
        if (!res || res.status !== true || !res.data) throw new Error('bad config');
        store(function () { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: res.data })); });
        return res.data;
      })
      .catch(function (e) { clearTimeout(timer); throw e; });
  }

  function applyConfig(cfg) {
    state.config = cfg;
    var name = $('#brandName'), logo = $('#logo');
    name.textContent = cfg.brand_name;
    $('#footBrand').textContent = cfg.brand_name;
    if (cfg.logo_url) { logo.src = cfg.logo_url; logo.hidden = false; name.hidden = true; }
    else { logo.hidden = true; name.hidden = false; }

    var demo = $('#demo');
    if (cfg.demo_url) { $('#demoLink').href = cfg.demo_url; demo.hidden = false; } else { demo.hidden = true; }

    var mail = $('#footEmail');
    if (cfg.contact_email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.contact_email)) {
      mail.textContent = cfg.contact_email; mail.href = 'mailto:' + cfg.contact_email; mail.hidden = false;
    } else { mail.hidden = true; }

    $all('[data-event]').forEach(function (el) { el.hidden = !cfg['show_' + el.getAttribute('data-event')]; });
    renderTypeOptions();
    renderWhatsApp();

    $('#closedMsg').hidden = cfg.booking_open;
    $('#submitBtn').disabled = !cfg.booking_open;
    $all('#bookingForm input, #bookingForm select, #bookingForm textarea').forEach(function (el) { el.disabled = !cfg.booking_open; });
  }

  function renderWhatsApp() {
    var cfg = state.config, num = cfg.whatsapp_number;
    var msg = cfg['whatsapp_msg_' + state.lang] || '';
    var href = num ? 'https://wa.me/' + num + (msg ? '?text=' + encodeURIComponent(msg) : '') : '';
    $all('[data-wa]').forEach(function (a) {
      if (href) { a.href = href; a.hidden = false; } else { a.removeAttribute('href'); a.hidden = true; }
    });
  }

  function renderTypeOptions() {
    var sel = $('#f-type'), current = sel.value;
    sel.textContent = '';
    var first = document.createElement('option');
    first.value = ''; first.textContent = t('form.type.pick');
    sel.appendChild(first);
    TYPES.forEach(function (ty) {
      if (!state.config['show_' + ty]) return;
      var o = document.createElement('option');
      o.value = ty; o.textContent = t('event.' + ty + '.t');
      sel.appendChild(o);
    });
    sel.value = current;
  }

  /* ---------- form ---------- */

  function setErr(input, key) {
    var field = input.closest('.field');
    field.classList.toggle('bad', !!key);
    $('.err', field).textContent = key ? t(key) : '';
  }

  function validate(form) {
    var ok = true;
    var name = form.elements.name, phone = form.elements.phone, type = form.elements.eventType, date = form.elements.eventDate;
    var digits = phone.value.replace(/\D/g, '');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var checks = [
      [name, name.value.trim().length >= 1, 'err.name'],
      [phone, digits.length >= 9 && digits.length <= 15, 'err.phone'],
      [type, !!type.value, 'err.type'],
      [date, !date.value || new Date(date.value + 'T00:00:00') >= today, 'err.date']
    ];
    checks.forEach(function (c) { setErr(c[0], c[2] && !c[1] ? c[2] : ''); if (!c[1]) ok = false; });
    return ok;
  }

  function post(payload, retried) {
    if (mock) {
      return new Promise(function (resolve) {
        setTimeout(function () { resolve(mock === 'fail' ? { status: false, message: 'x' } : { status: true, message: 'Booking received' }); }, 400);
      });
    }
    if (!SITE.scriptUrl) return Promise.reject(new Error('no script url'));
    return fetch(SITE.scriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.message === 'Busy, please try again' && !retried) {
          return new Promise(function (resolve) { setTimeout(resolve, 1500); }).then(function () { return post(payload, true); });
        }
        return res;
      });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    var form = ev.target, btn = $('#submitBtn'), status = $('#formStatus');
    status.className = 'status'; status.textContent = '';
    if (!validate(form)) return;
    btn.disabled = true; btn.textContent = t('form.sending');
    var f = form.elements;
    post({
      action: 'booking', name: f.name.value.trim(), phone: f.phone.value.trim(), eventType: f.eventType.value,
      eventDate: f.eventDate.value, note: f.note.value.trim(), lang: state.lang, website: f.website.value
    }).then(function (res) {
      if (res && res.status === true) {
        status.className = 'status ok'; status.textContent = t('form.ok');
        form.reset();
      } else { throw new Error('rejected'); }
    }).catch(function () {
      status.className = 'status fail'; status.textContent = t('form.err');
    }).then(function () {
      btn.disabled = !state.config.booking_open; btn.textContent = t('form.submit');
    });
  }

  /* ---------- start ---------- */

  function init() {
    $all('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
    $('#bookingForm').addEventListener('submit', onSubmit);

    var lang = detectLang();
    state.lang = lang;
    // English is always loaded as the fallback for missing keys.
    fetchJson('i18n/en.json').then(function (en) {
      state.fallback = en;
      return setLang(lang);
    }).then(function () {
      applyConfig(normalizeConfig(SITE.config));
      return loadConfig();
    }).then(function (raw) {
      applyConfig(normalizeConfig(raw));
    }).catch(function () {
      // Config unreachable: keep the defaults. WhatsApp stays hidden, the form still works.
      applyConfig(normalizeConfig(SITE.config));
    });
  }

  init();
})();

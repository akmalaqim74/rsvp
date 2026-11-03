# Architecture — RSVP product landing page

## Stack and why
- **Vite + React + TypeScript + Motion (CEO decision, 2026-11-03).** Builds to plain static files, so hosting stays free. React for reusable components, Motion (lazy, small build) for scroll reveals, entrances and button feedback; reduced-motion users get fades only. Replaced the first plain HTML/CSS/JS version (kept on branch `feature/landing-page`).
- **Backend: one Google Sheet + one Apps Script web app.** Free, the CEO already uses it, and the Sheet is the dashboard.
- **Hosting:** Cloudflare Pages (free) on a subdomain. CEO adds one CNAME record at his DNS later. Until then it runs on the free `*.pages.dev` address. Alternative: Netlify or GitHub Pages (same cost, fewer extras).

## Folder structure
```
rsvp-landing/
  index.html  package.json  vite.config.ts  tsconfig.json
  src/main.tsx  App.tsx  styles.css  motion.ts  types.ts
  src/components/    Header Hero Sections Booking Footer WhatsAppLink
  src/lib/           config.ts (defaults, Sheet config, mock) booking.ts i18n.tsx siteConfig.tsx
  src/i18n/          en.json ms.json
  apps-script/Code.gs  appsscript.json   (pasted into the Sheet by the CEO)
  tests/apps-script.test.js
  docs/
```

## Config from the Sheet (CEO decision)
Business details are not in the code. The page calls `GET ?action=config` on load and applies the result. `Config` tab keys:

| key | example | note |
|---|---|---|
| brand_name | (CEO) | text shown if no logo |
| logo_url | https://... | https only, optional |
| whatsapp_number | 60xxxxxxxxx | digits with country code |
| whatsapp_msg_en / whatsapp_msg_ms | Hi, I want to book an invitation | pre-filled text |
| contact_email | (CEO) | optional, shown in footer |
| demo_url | https://... | link to `rsvp-invite` demo |
| show_wedding / show_birthday / show_funeral / show_other | TRUE/FALSE | which event cards and form options appear |
| booking_open | TRUE | FALSE hides the form, WhatsApp stays |
| notify_email | (CEO) | gets an email per booking; optional |

Rules:
- **Defaults ship in `src/lib/config.ts`** with no phone number and no personal data. Brand name falls back to a neutral placeholder, all four event types visible except funeral.
- **If the config call fails or takes over 3 s:** page renders with defaults; WhatsApp buttons stay hidden (never guess a number); the form still works.
- Config response is cached in `sessionStorage` for 10 minutes to avoid a Sheet call on every navigation. Because the number can change, the cache is short.
- **All config text is inserted with `textContent`, never `innerHTML`.** `logo_url` and `demo_url` must start with `https://` or are ignored. `whatsapp_number` must be digits only, 9 to 15 long, or is ignored. The WhatsApp link is built in JS as `https://wa.me/<number>?text=<encoded>`.

## Booking form and where data goes (privacy)
- Fields: name, phone, event type, optional event date, optional note, language, honeypot `website`.
- POST to the Apps Script URL (`Content-Type: text/plain`, JSON body), same pattern as `rsvp-invite`. The script URL is public by design; the Sheet itself stays private to the CEO.
- Data collected is personal (name, phone). Stored only in the CEO's Sheet. Not sent to any third party. Privacy line shown next to the form. No analytics cookies in v1 (so no cookie banner).
- Claude writes `Code.gs` and the form validation, and reviews them line by line.

## Spam and abuse limits
Apps Script cannot see IP addresses, so limits are by content:
- Honeypot field. Silent success, nothing written.
- Max 3 submissions per phone number per day; max 100 bookings per day overall; beyond that the script returns "Please WhatsApp us instead".
- Server validation of every field (lengths, event type in the allowed list, phone digits), formula-injection prefixing on every text cell, `LockService` around writes.
- Client disables the submit button while sending and keeps the same retry rule as `rsvp-invite` for "Busy".

## Performance budget
- Lighthouse mobile at least 90 on Performance, Accessibility, Best Practices, SEO (not yet measured).
- No images in v1 beyond optional logo; visuals later come from Gemini Flow. JS about 106 KB gzipped (React plus lazy Motion), CSS under 25 KB, system fonts. Animate only the hero, scroll reveals and the form.
- No third-party scripts.

## i18n
- Two JSON files in `src/i18n/`, keys identical, bundled into the app. Language chosen from `localStorage`, else BM if `navigator.language` starts with `ms`, else English. Toggle in header. `<html lang>` updated on switch. Missing key falls back to English. Adding a language = one new JSON file plus one toggle button.

## SEO and sharing
- One page. `<title>` and meta description are static HTML, so they are English in v1 (no `hreflang`). JS updates `<title>` on language switch. Open Graph tags added so the link previews well when shared on WhatsApp.

## Decisions log
| Decision | Alternatives | Reason |
|---|---|---|
| Vite + React + TS + Motion | Plain HTML/JS, Next.js, Astro | CEO wants richer animation and UI; Vite keeps it static and free; Next/Astro are overkill for one page |
| Google Sheet + Apps Script | Supabase, Firebase, form SaaS | CEO decision; free; Sheet is the dashboard |
| Business details read from Sheet Config | Hard-coded config.js | CEO decision; change number/logo without redeploy |
| Safe defaults, hide WhatsApp if no config | Hard-coded fallback number | Never show a wrong number; no personal data in the repo |
| System fonts (v1) | Self-hosted or Google Fonts | No download, fastest; revisit with the Flow visuals |
| Cloudflare Pages | Netlify, GitHub Pages | Free, simple CNAME for subdomain |
| Per-phone and daily caps | CAPTCHA | CAPTCHAs add friction and a third party; caps are enough at our volume |

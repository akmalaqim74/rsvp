# RSVP product landing page

Promotes our RSVP invitation product (weddings, birthdays, tahlil, any event). Visitors read the page, then WhatsApp us or send a booking form. Bookings land in a Google Sheet. Built with Vite + React + TypeScript + Motion; builds to static files. No server, no database.

The product itself (the invitation page guests open) is in `../rsvp-invite/`. This page links to it as the live demo.

## What the CEO controls from the Sheet (no redeploy)
Everything in the **Config** tab: brand name, logo link, WhatsApp number and its pre-filled message (BM and EN), contact email, demo link, which event types show (`show_wedding`, `show_birthday`, `show_funeral`, `show_other`), `booking_open`, and `notify_email` (private, never sent to the page).
The page shows safe defaults until the Sheet answers. If the Sheet is down the WhatsApp buttons stay hidden (the page never guesses a number).

## Set up (about 20 minutes)
1. Open **sheets.new**, name it "RSVP landing". **Extensions > Apps Script**, replace everything with `apps-script/Code.gs`, save.
2. Project Settings (gear) > tick **Show "appsscript.json"**, open it and paste `apps-script/appsscript.json`, save.
3. Reload the Sheet. Menu **Landing tools > Set up tabs (first time)**. Approve the permission box (the "unverified app" warning is normal for your own script).
4. Fill the **Config** tab (at least `brand_name`, `whatsapp_number` like `60123456789`). Run **Landing tools > Check setup**; it should say "Setup looks good."
5. **Deploy > New deployment > Web app**. Execute as **Me**, access **Anyone**. Copy the Web app URL.
6. Paste that URL into `scriptUrl` in `src/lib/config.ts` and commit. (The URL is public by design; the Sheet stays private.)
7. After any change to `Code.gs`, use **Deploy > Manage deployments > edit > New version**.

Bookings appear in the **Bookings** tab; change the `status` column as you follow up.

## Host on a subdomain (Cloudflare Pages, free)
1. Cloudflare Pages > create project from this repo. Build command `npm run build`, output folder `dist`.
2. Custom domain: add `rsvp.<your-domain>`. Cloudflare shows one CNAME record; add it where you manage the DNS.
Until then the site runs on the free `*.pages.dev` address.

## Run and check locally
```bash
npm install
npm run dev      # http://localhost:8765 (or the port Vite prints)
npm run build    # typecheck and build to dist/
npm test         # the Sheet script's automatic checks
```
Open `/?mock=1` on localhost to preview with sample config and a fake booking success. Variants: `?mock=funeral`, `?mock=closed`, `?mock=fail`. The mock only works on localhost.

## Languages
`src/i18n/ms.json` and `src/i18n/en.json` hold every visible word. To add a language, copy `en.json`, translate, import it in `src/lib/i18n.tsx` and add the code to `LANGS` in `src/types.ts`.

## Images, icons, video
None are used yet (the phone preview is plain CSS, animated with Motion). When we want real ones they are made in Gemini Flow, not generated here.

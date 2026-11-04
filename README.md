# RSVP product landing page

Promotes our RSVP invitation product (weddings, birthdays, tahlil, any event). Visitors read the page, then WhatsApp us or send a booking form. Bookings land in a Google Sheet. Built with Vite + React + TypeScript + Motion; builds to static files. No server, no database.

The product itself (the invitation page guests open) is in `../rsvp-invite/`. This page links to it as the live demo.

## What the CEO controls from the Sheet (no redeploy)
Everything in the **Config** tab: brand name, logo link, WhatsApp number and its pre-filled message (BM and EN), contact email, one demo link per event type (`demo_wedding_url`, `demo_birthday_url`, `demo_funeral_url`, `demo_other_url`), which event types show (`show_wedding`, `show_engagement`, `show_baby`, `show_birthday`, `show_graduation`, `show_anniversary`, `show_corporate`, `show_festive`, `show_funeral`, `show_other`), `booking_open`, and `notify_email` (private, never sent to the page).
The page shows safe defaults until the Sheet answers. If the Sheet is down the WhatsApp buttons stay hidden (the page never guesses a number).

The demo section shows one tab per enabled event type. A tab without a demo link says "Live demo coming soon" until you add its link in Config.

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
Cover art is made in Gemini Flow, not generated here. Each design's cover is `public/art/cover-<category>-<n>.webp` (720x1280).

## Adding cover art (`npm run thumbs`)
After dropping new `cover-*.webp` files into `public/art/`, run `npm run thumbs`. It makes a small tile thumbnail for each in `public/art/thumbs/` (240x427, about 10 KB) and rewrites `src/demos/coverArt.ts`. `npm run build` does this first automatically. A design in `src/demos/more.ts` appears in the gallery and its route works only when its cover art exists; the older designs (wedding 4, tahlil 1-3) always show. `npm test` fails if a cover has no thumbnail or the list is out of date.

## Music credits
Invitation pages can play optional background music from `public/audio/<category>-<n>.mp3` (fallback `<category>.mp3`). Tracks are royalty-free (Pixabay Content License); titles and links are in `public/audio/SOURCES.md`. Music starts only after the guest taps "Open invitation", can be muted with the round button, and never plays in the landing-page demo modal. No file means no button.

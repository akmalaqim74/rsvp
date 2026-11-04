# Review: React rebuild + demo section (2026-11-04) (Claude built and reviewed; no independent check)

Branch: `feature/react-frontend` (from `feature/landing-page`, which holds the plain HTML version). Gate was skipped for Gemini (`agy` broken); the CEO or Gemini should still look before launch.

## Verified
- `npm run build` (typecheck with strict TypeScript, no `any`) passes. `npm test`: 9 of 9 Sheet-script tests pass.
- Browser, phone width 375px, no console errors, no sideways scroll: Sheet config applied, BM/EN switch (saved), validation errors, sending state, success message, scroll reveals, funeral card by flag, bookings-closed state, defaults with no config (no WhatsApp, no demo, clear error on submit).
- Contrast: all text pairs at least 4.5:1.
- Reduced motion: handled in code (`MotionConfig reducedMotion="user"`), not tested with the OS setting.

## Not verified
- **The real Apps Script was never run** against a Sheet (row append, locks, email, caps). First real test is the CEO's Sheet setup, then one test booking.
- Lighthouse not run; JS is about 106 KB gzipped, so mobile performance needs measuring. Not tested on a real phone or Safari.
- BM copy needs a native speaker's read.

## Known small gaps
- If config fails, the error says "WhatsApp us" while the WhatsApp button is hidden. Fix later by showing the contact email.
- Page `<title>`/meta in the HTML are English (the app swaps the title for BM).
- No favicon or share image yet (visuals come from Gemini Flow).

## Added 2026-11-04 (after Gemini UI/UX critique)
- One demo section with tabs per event type, quiet Tahlil variant, per-type demo links from Config; old event cards removed; demo moved under the hero.
- Hero: outcome headline, WhatsApp primary, Book now outline. Real fonts (Fraunces, Inter) bundled via npm, no third-party request.
- Checked at 375px and 320px in BM (no overflow, buttons at least 44px) and on desktop; tabs, arrow-key navigation and Tahlil palette work.
- Not verified: real demo links (none hosted yet), Lighthouse with the added fonts, Safari/real phone, screen reader pass.

## Added 2026-11-04 (demo invitation redesign: cards, not app screens)
Branch `feature/react-frontend`. Built and reviewed by Claude, no independent check. Reason: the CEO rejected the first demo page (it looked like an app screen); research in `docs/research/competitors.md`.

### What changed
- **Invitation page (`/:category/:id`)** is now a card: full-screen cover of two paper doors (double ornamental border, wide-spaced capital serif lettering, CSS wax seal with monogram, "Specially invited" tag from `?to=Name`, "Open invitation" pill). The doors part with Motion, then the card shows names and parents, one or more events (Akad + Reception) with Google Maps, Waze, copy address and add-to-calendar (.ics), countdown (not for tahlil), a parking/surau note, one-tap RSVP (attend or not, adult and child counters, name prefilled from the link), WhatsApp contact (number from the Sheet Config), and a closing doa. RSVP stays simulated (nothing sent). The "sample, nothing saved" banner and "Get yours" bar stay.
- **9 designs** in `src/demos/data.ts`: wedding x3 (Sage and Gold, Blush Rose, Midnight Navy), birthday x2 (Warm Terracotta, Plum and Champagne), tahlil x2 (Quiet Green, Soft Slate; ring seal, no countdown, respectful wording, single counter), other x2 (Ink Blue dinner, Dusty Blue aqiqah). Event dates are computed from today (next Saturday etc.), so a sample never says "the event is over".
- **Landing demo section:** tabs per event type, each shows card-cover tiles; tapping one opens the live sample in a modal (same-origin iframe, `?embed=1`, "Open full page", close button, Esc inside and outside the iframe, focus trap, focus restored). Modal and invitation page are lazy chunks.
- **Art slots:** `public/art/<corner|divider|seal>-<category>.webp` are picked up automatically; clean CSS/SVG fallback when absent. Briefs in `docs/design/flow-briefs.md`. No art was generated or drawn.
- Copy: new keys in both `src/i18n/*.json` (identical key sets; old unused demo keys removed).

### Verified
- `npm run build` exit 0 (strict TypeScript) and `npm test` exit 0 (9 of 9).
- Bundle: landing JS 127.6 KB gzip (was 122.1 KB before this work); invitation page chunk 4.1 KB gzip, modal 1.2 KB gzip, loaded only on demand. CSS 6.3 KB gzip.
- Contrast, measured by script on every design (9 text pairs x 9 designs = 81 pairs: ink, muted, label colour on both paper tones, cover text, button text, seal monogram): lowest ratio 5.21:1, all pass AA 4.5:1. Decorative gold lines on paper are 1.7 to 2.7:1 on purpose (decoration only, no information); input and control borders use the muted text colour (at least 5.9:1). WhatsApp button white on `#0E7A40` 5.42:1.
- Browser, 375px: every one of the 9 covers viewed; wedding Sage and Gold walked end to end (cover, opening, all sections, RSVP controls); tahlil (both) viewed at 375px and 320px in BM and the RSVP section of tahlil at 320px BM; wedding Midnight Navy at 320px BM (longest guest name). No sideways scroll at 320px, no tap target under 44px on the checked pages. Desktop: cover, doors opening and the card revealed, gallery tiles, modal.
- Behaviour tested: doors part then unmount; `?to=` text shown as plain text (HTML characters stripped); .ics file content correct (10:00 Kuala Lumpur = 02:00 UTC, escaped commas); Maps link built from venue and address; Esc inside the iframe closes the modal via postMessage, page unlocks and focus returns to the tile; art slot swaps in when a file exists and falls back when absent (tested with a temporary file, removed). No console errors.

### Not verified
- **Reduced motion** (OS setting) is coded (doors replaced by a fade, MotionConfig) but not tested with the real setting.
- Copy-address button: the clipboard was blocked in the preview pane, so the success message was not seen; a failure message was added and not seen either.
- Real phone, Safari (iOS handling of the .ics download and of `inert`), Lighthouse, screen reader pass. Waze and Google Maps links open searches for invented addresses, so they land on nothing useful by design (sample).
- Modal focus trap across the iframe boundary was reasoned out, not tested with a keyboard. The page must be allowed to be framed by its own origin (default on static hosts; do not set `X-Frame-Options: DENY`).
- BM wording of the new copy needs a native read.

### Honest design gaps (CEO wants perfect)
- All 9 covers share one layout; they differ by palette, seal and wording only. EkadInvite has hundreds of layouts. Real variety needs the Flow art (corners, seal, dividers) and a second cover layout.
- No script or calligraphy font for names (we bundle only Fraunces). A script face would feel more "wedding"; it needs the CEO's OK on adding a font.
- Tiles show a static cover; no motion preview. Third tile sits alone on a second row at phone width.
- No background music, gallery or guestbook (competitors have them); out of scope here.
- Tahlil route stays `/funeral/...` (config key `show_funeral`); the URL is visible to guests. Suggest renaming to `/tahlil/` before launch (needs the CEO's say).

## Added 2026-11-04 (CEO feedback: "doesn't feel like a wedding invitation", "is wedding green?")
- **Wedding is no longer green.** Lead design `id-1` is ivory paper, muted gold `#B8935A`, blush page tint and a rose wax seal; `id-2` Blush Rose; `id-3` Midnight Navy; the sage green one is now `id-4`, last in the gallery. Tahlil stays green/slate.
- **Art slots changed:** `public/art/corner-<cat>-tl.webp` and `-br.webp` (800x800, may differ, not mirrored), `divider-<cat>.webp`, `seal-<cat>.webp`. Art mode shows only the two big corners (about 42 percent of the width); without art the four small geometric corners remain. Briefs and `public/art/README.txt` updated.
- **New wedding sections** (all optional per design in `src/demos/data.ts`, all sample, BM + EN): Our story timeline, programme (aturcara), photo gallery (swipeable strip of framed "Your photo here" placeholders plus a lightbox with arrows, Esc and focus trap), digital gift (sample DuitNow QR card, copy account number), guestbook (simulated, nothing saved), contact persons (WhatsApp via Config number). Birthday and other get programme, gallery, wishes or contacts as fits; tahlil only has the programme (no gallery, wishes, gift, story).
- **Page feel:** each section is a framed "page" with grain texture, divider art on top, gentle reveals and a "Scroll" hint.
- Checked: build and tests exit 0; contrast script on all 10 designs, no text pair under 4.5:1; cover automated check (names, seal, tag, button not covered by anything, real click opens the card, no sideways scroll) on all 10 designs: EN 375 normal and embed, EN 320 normal and embed, BM 375 normal and embed, BM 320 normal: all pass (BM 320 embed not run). Screenshots: all 10 covers in BM at 375, 9 in EN earlier plus the wedding lead with the real art; sections story, programme, gallery, gift and wishes viewed at 375 EN; lightbox (open, arrow, Esc) and wish submission tested by script; tahlil section list confirmed to have no gallery or wishes.
- **Not done / not verified:** Remotion project (waiting for the art; plan: `motion/` with its own package.json, loop-wedding.webm 720x1280 6 s under 400 KB, door/petals clip only if alpha output is practical). Art for birthday, tahlil and other does not exist yet (fallbacks show). The wedding art is reused by all four wedding designs (rose florals on navy and sage were not judged for contrast or taste). `portrait-bride.webp` and `portrait-groom.webp` appeared in `public/art/` but nothing uses them yet. Real phone, Safari, reduced motion and screen reader still untested; carousel swipe was not tried on touch; BM copy of new sections needs a native read.

## Portrait Doors (wedding id-4)
- New wedding design `id-4` "Portrait Doors" / "Pintu Potret": ivory inside card, dark photographic cover. Groom portrait on the left door, bride on the right, thin gold double border, names over a dark scrim, seal on the seam. Sage and Gold moved to `id-5`.
- Photos: `public/art/portrait-groom.webp` / `portrait-bride.webp`, labelled "Sample photo"; each door falls back on its own to a tonal "Your photo" panel. `fetchpriority=high` only on the real cover, tiles load lazily.
- Looked at: 375 and 320 px, EN, both photos and groom only, click opens the doors into the ivory card, gallery tile. Not looked at: BM cover screenshot, no photos at all, reduced motion, real phone.

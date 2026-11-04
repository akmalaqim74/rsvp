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

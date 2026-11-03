# Review: first build (Claude built and reviewed; no independent check)

Branch: `feature/landing-page`. Because the gate was skipped and Claude wrote the code, the CEO or Gemini should still look at it before launch.

## Verified
- `node tests/apps-script.test.js`: 9 of 9 pass (sanitising, phone, dates, event-type flags, config whitelist never leaks `notify_email`, validation, caps).
- Browser, phone width 375px, no console errors, no sideways scroll: config applied, BM/EN switch (saved), validation errors, sending state, success message, WhatsApp link per language, funeral hidden/shown by flag, bookings-closed state, defaults with no config (WhatsApp and demo hidden, clear error on submit).
- Contrast: all text pairs at least 4.5:1 after two fixes (WhatsApp green, step numbers).

## Not verified
- **The real Apps Script was never run** (no deployed Sheet yet): the logic is unit-tested, the Sheet calls (`appendRow`, locks, email) are not. First real test is CEO step 5 above, then submit a booking and check the row.
- Lighthouse not run. Not tested on a real phone or Safari.
- BM copy needs a native speaker's read (CEO).
- No favicon or share image yet (visuals come from Gemini Flow).

## Known small gaps
- If config fails, the error says "WhatsApp us" while the WhatsApp button is hidden. Fix later by showing the contact email.
- Page `<title>`/meta are English in the HTML (JS swaps the title for BM).

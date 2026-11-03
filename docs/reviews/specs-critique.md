# Critique: specs gate

**Gate skipped for Gemini.** The `agy` command is broken on the CEO's Mac and the CEO said not to use it (2026-11-03). Claude did a self-review instead. It is not an independent critique; the final code review is therefore the only second look, so it will be strict.

## Points (Claude, self-review)
1. **Apps Script cold start (1 to 3 s) on config call** — page must not wait on it. Response: Accept. Page renders from defaults at once; WhatsApp buttons appear when config arrives; 10-min session cache.
2. **Daily cap can be used to block real leads** — a spammer filling 100 slots. Response: Accept risk. The form then says "WhatsApp us instead", and the WhatsApp button never depends on the cap.
3. **Per-phone cap is bypassed by rotating phones** — Response: Accept risk; honeypot + server validation + cap is enough at our volume. Revisit if the Sheet fills with junk.
4. **Public config exposes the WhatsApp number and email** — Response: Accept; they are printed on the page anyway. `notify_email` is never returned (whitelist).
5. **Page `<title>` and meta are English only** — Response: Accept for v1; JS updates the title on switch.
6. **Self-hosted fonts need a download** — Response: Change. v1 uses system font stacks (Georgia for headings, system-ui for body). No download, faster, looks fine. Fonts can be added later.
7. **Funeral wording** — Response: Accept. Quiet tone, no emoji or exclamation marks, and the card is hidden unless `show_funeral` is TRUE.

## Escalated to CEO
- none

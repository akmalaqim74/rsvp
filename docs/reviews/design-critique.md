# Critique: UI/UX (Gemini, run in the CEO's Chrome, 2026-11-04)

Gemini was given a written description of the page (it is not public). Conversation: Gemini history, "Landing Page UX Design Critique".

## Points and Claude's response
1. **Hero headline is an admin benefit; two CTAs cause indecision.** Suggests an outcome headline and one primary CTA (WhatsApp) with a text link for the form.
   - **Accept (headline):** "Digital invitations with RSVP in one link" style, the counting line moves to the subline.
   - **Accept (CTAs), with the CEO's OK:** WhatsApp stays the filled primary button; "Book now" becomes a quieter outline button. Both remain, so the CEO's two-way contact decision holds.
2. **Hidden prices and no trust signals look risky; add "from RMxx", counters, money-back guarantee.**
   - **Reject price:** CEO decided "contact us for a quote".
   - **Reject counters and guarantee:** we have no real numbers or guarantee; nothing is invented on this page.
   - **Accept in part:** the live demos are our trust signal, so they move up (point 3). Real proof (setup time, events done) goes in only when the CEO gives true facts.
3. **Demo is buried; move it right under the hero.**
   - **Accept.** New order: hero, demos, how it works, what you get, booking, FAQ. The separate "For every event" cards merge into the demo section (it already shows one demo per event type), which is exactly the CEO's "one section where all demo products are".
4. **Multi-event demo on phone: use tabs and one phone frame, not a long scroll or modals.**
   - **Accept:** tabs (Wedding, Birthday, Tahlil, Other; only the types enabled in Config) swapping one CSS phone preview, plus one "Open live demo" button.
   - **Reject iframes:** slow, can break inside WhatsApp's in-app browser; we link out instead.
5. **Tahlil next to birthdays looks tone-deaf if styled the same.**
   - **Accept:** the Tahlil tab gets a quiet palette (deep green and slate), no exclamation marks, and a respectful label ("View sample"). The global "Book now" stays as is.
6. **Contrast of terracotta on ivory is about 4.2:1; Georgia too small; BM text may wrap.**
   - **Reject the number:** measured 4.7:1 for terracotta text on ivory and 4.99:1 for white on the terracotta button; both pass AA.
   - **Already true:** Georgia is used only for headings.
   - **Accept:** check the BM layout at 375px and 320px for wrapping.
7. **Looks like a template; build real-UI previews (RSVP counters, map button, add-to-calendar), add local motifs.**
   - **Accept:** the phone preview shows real UI pieces (a "Sample" RSVP count chip, a map button), all labelled Sample.
   - **Reject songket-style motifs drawn by us:** risks looking fake or disrespectful, and the CEO's rule is that real visuals come from Gemini Flow. Added to the Flow brief instead.

## Escalated to CEO (business trade-offs only)
- **Hero buttons:** make WhatsApp the main (filled) button and "Book now" the quieter one?
- **Trust:** is there any true fact we can state (for example how fast we deliver an invitation, or how many events done)? If not, we say nothing.

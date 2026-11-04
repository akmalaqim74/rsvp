# Layout — mobile first, single page

Header (sticky): logo or name left, BM/EN toggle, small "WhatsApp" button.

1. **Hero.** Outcome headline, one subline, **WhatsApp us** as the filled primary button and **Book now** as a quieter outline button that scrolls to the form (pending CEO OK, see critique). Below, a phone mockup of a sample invitation (CSS drawn, labelled Sample).
2. **Demos (one section, CEO decision 2026-11-04).** Segmented tabs: Wedding, Birthday, Tahlil, Other (only types enabled in Config). One CSS phone preview swaps per tab (sample RSVP count chip, map button, all labelled Sample), a one-line benefit, and one "Open live demo" button to that type's demo URL from Config (hidden if no URL). The Tahlil tab uses a quiet palette and wording. This replaces the old separate event cards and the single demo button.
3. **How it works.** 3 numbered cards: We design your invitation / You share one link / Replies land in your Sheet.
5. **What you get.** 6 short items: personal link per guest, shared link, live reply list in Sheet, pax totals, RSVP deadline, map button.
6. **Book / contact.** Form on the left, WhatsApp button and short promise ("We reply the same day") on the right (stacked on mobile). Privacy line under the form.
7. **FAQ.** 5 questions, accordion: How much (contact us), Do guests need an app (no), Who owns the data (you), Can it be BM only (yes), How long to set up.
8. **Footer.** Name, WhatsApp, email (all from Config), language toggle, privacy note.

Form fields: name, phone, event type (select, enabled types only), event date (optional), note (optional). Submit shows inline success ("Thanks, we will WhatsApp you") with the WhatsApp button as the fallback. Errors under each field.

Desktop: same order, two columns in sections 2, 3, 5, 6; content max 1040px.

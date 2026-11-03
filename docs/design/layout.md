# Layout — mobile first, single page

Header (sticky): logo or name left, BM/EN toggle, small "WhatsApp" button.

1. **Hero.** Headline, one subline, two buttons of equal weight: **WhatsApp us** (green) and **Book now** (terracotta, scrolls to form). Below, a phone mockup of a sample invitation (CSS drawn, labelled Sample).
2. **How it works.** 3 numbered cards: We design your invitation / You share one link / Replies land in your Sheet.
3. **For every event.** Cards for Wedding, Birthday, Funeral/tahlil, Other. Each has a one-line benefit and a small sample. Cards are rendered only for event types enabled in Config. Funeral card copy is quiet and respectful (no exclamation marks, no emoji).
4. **Try it.** "See a live demo" button to `demo_url` (the `rsvp-invite` page). Note: opens a sample event with fake details.
5. **What you get.** 6 short items: personal link per guest, shared link, live reply list in Sheet, pax totals, RSVP deadline, map button.
6. **Book / contact.** Form on the left, WhatsApp button and short promise ("We reply the same day") on the right (stacked on mobile). Privacy line under the form.
7. **FAQ.** 5 questions, accordion: How much (contact us), Do guests need an app (no), Who owns the data (you), Can it be BM only (yes), How long to set up.
8. **Footer.** Name, WhatsApp, email (all from Config), language toggle, privacy note.

Form fields: name, phone, event type (select, enabled types only), event date (optional), note (optional). Submit shows inline success ("Thanks, we will WhatsApp you") with the WhatsApp button as the fallback. Errors under each field.

Desktop: same order, two columns in sections 2, 3, 5, 6; content max 1040px.

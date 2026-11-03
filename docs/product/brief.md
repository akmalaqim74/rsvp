# Product brief — RSVP product landing page

_Status: draft by PO (Claude). Awaiting CEO answers on the open items at the bottom._

## Business
- **What we sell:** a digital invitation page with built-in RSVP, for **any event**: weddings, birthday parties, funerals/tahlil, corporate events, anything. The product already exists as a template in `landing-pages/rsvp-invite/`.
- **How it works for the client:** guests open a link on their phone, read the event details and reply. Replies land in a Google Sheet the client owns. No app, no database, no per-guest accounts.
- **Who we sell to:** event hosts (families, individuals, small organisers). Guests never see this page.

## Target customer and the one action
- Host who is tired of chasing RSVPs by WhatsApp and wants a clean invitation plus a live reply list.
- **One action we want:** contact us to book. Two ways, same weight:
  1. **WhatsApp button** (opens a pre-filled message).
  2. **Booking/contact form** (name, phone, event type, event date, optional note) that writes a row to our Google Sheet.

## Problem we solve (what the visitor feels)
- Replies get lost in WhatsApp chats; nobody knows who answered or how many are coming.
- Printed or generic invitations give no head-count.
- Existing invitation platforms are rigid or charge per event.

## Positioning
- It is **not a wedding-only product**. The page must show several event types (wedding, birthday, funeral/tahlil, other) so a visitor with any event sees themselves. Funeral content needs a respectful tone; keep it separate from the celebratory visuals.

## Languages
- Multi-language, switchable on the page. Proposed v1: **Bahasa Melayu + English** (default by browser language). More later (Chinese, Tamil) if the CEO wants them. Copy lives in one strings file per language so adding one is a content job, not a rebuild.

## MVP scope (priority order)
1. **Hero:** one-line promise, language switch, WhatsApp + "Book now" buttons.
2. **How it works:** 3 steps (we make your invitation, you share one link, replies appear in your Sheet).
3. **Event types:** wedding, birthday, funeral/tahlil, other, each with a sample preview.
4. **Live demo link** to the existing `rsvp-invite` page, so visitors try it as a guest.
5. **What you get:** personal links per guest, shared link, live totals, deadline, map button.
6. **Pricing / packages:** only if the CEO supplies it (see open items); otherwise "contact us for a quote".
7. **Booking form** + WhatsApp button, repeated at the bottom.
8. **FAQ** (short) and footer with contact.

## Out of scope (explicit)
- No accounts, payments, online checkout or admin dashboard. The Sheet is our dashboard.
- No blog, no testimonials until we have real ones (nothing invented).
- No self-service invitation builder. We build each invitation for the client.
- No automated WhatsApp sending.

## Backend (decided by CEO)
- **Google Sheet via Apps Script web app**, same pattern as `rsvp-invite`. Every booking form submit appends a row (timestamp, name, phone, event type, event date, note, language, source).
- Personal data (names, phones) is collected, so Claude writes or line-reviews the form and script: input validation, hidden spam trap (honeypot), rate limit, Sheet kept private, and a short privacy note next to the form.

## Hosting (decided by CEO)
- Static site on its **own subdomain** (for example `rsvp.<our-domain>`), separate from the invitation template.

## Success measure
- A visitor understands what we sell in 10 seconds, on a phone.
- A visitor can reach us (WhatsApp tap or form) in under 30 seconds.
- Every booking arrives as a Sheet row and we can reply the same day.

## Challenge check
- Smaller version that still works: hero, event types, demo link, booking form + WhatsApp. Pricing, FAQ and "what you get" can follow.
- Everything shown must be real. Sample previews use placeholder events and are labelled as samples.

## CEO decisions (2026-11-03)
1. **Languages:** Bahasa Melayu + English for v1.
2. **Pricing:** none on the page. "Contact us for a quote".
3. **Domain:** CEO sets up the subdomain and manages the DNS later. Not blocking the build.
4. **WhatsApp number:** comes from the Google Sheet `Config` tab, not hard-coded.
5. **Product name and logo:** from the `Config` tab too.
6. **Funeral event type:** shown or hidden per the `Config` tab.

**Consequence:** the page is a static shell and reads its business details (name, logo, WhatsApp number, which event types to show, contact email) from the Sheet at load. The CEO changes them in the Sheet with no redeploy. The page ships with safe defaults so it still works if the Sheet is slow or down (see `docs/specs/architecture.md`).

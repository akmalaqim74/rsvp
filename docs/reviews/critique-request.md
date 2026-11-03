# Gate request: critique of brief, design and specs (one round)

You are the Critic. Read, in `landing-pages/rsvp-landing/docs/`: `product/brief.md`, `design/*.md`, `specs/*.md`.
Write your points into `docs/reviews/specs-critique.md` using `templates/critique.md` (leave "Claude's response" empty).

Look hard at: abuse and spam of the booking form with no CAPTCHA; the config-from-Sheet design (failure modes, data exposure, cache); Apps Script limits (quotas, concurrency, cold start latency on first load); multi-language gaps (BM copy, `<title>`/SEO in one language); funeral-event sensitivity; accessibility and contrast; anything missing from the MVP that would stop a host from booking.
Be specific: area, concern, suggested change. Do not edit any other file.

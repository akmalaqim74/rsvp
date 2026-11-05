# Design audit: all art-led invitation designs

Scope: every design with cover art (112 art files; funeral hidden by default). Method: headless Chrome at 390x844 (reduced motion on). One capture of the closed cover and of the opened card at 18%, 50% and 82% scroll, stitched into contact sheets of six designs and reviewed by eye. Plus a measured pass: cover ink against the cover art under the cover scrim (WCAG ratio, worst pixel of the lettering zone). Horizontal overflow checked via `scrollWidth` (390px: none on any design).

Status: FIXED = changed in this pass (see `git log`); OPEN = needs art or a CEO choice.

## Ranked fix list (systemic first)

| # | Problem | Affects | Status |
|---|---|---|---|
| 1 | Cover lettering sat on a hazy blob: art and cover colour had opposite polarity (pale art, dark cover colour, light ink). Ratio 3.8 to 4.4 on 8 designs, and the interior veil went near-black. | engagement-5, baby-5, birthday-20, funeral-6, anniversary-1, festive-4 (+2 marginal) | FIXED: tone flipped on 6, scrim 62% to 72%; all 108 measured now 4.5 or better |
| 2 | Striped, blocky bars at the edge of paper sections (border-image on `geo` and `songket` looks). | every geo/songket design | FIXED: clean double hairlines |
| 3 | Sample wishes were the wedding text ("lifetime of happiness", "bless your home") on baby, birthday, graduation, corporate, festive pages. | about 70 designs | FIXED: occasion-specific wishes, EN and MS |
| 4 | Cover and interior used different type: cover has a per-design names face, the interior ignored it. | all designs | FIXED: interior names and headings follow the cover pairing |
| 5 | Music and auto-scroll buttons sat top-right over section headings. | all designs | FIXED: moved bottom-right |
| 6 | Every design in a category has the same interior: same sections, same order, same sample copy (the story "How we met" is identical on all 19 weddings). Designs differ only by art and colour. | all categories | OPEN: needs per-design copy and 2 to 3 section variants |
| 7 | Names over faces or bodies on photo covers. | graduation-1/2/3/4, anniversary-1, wedding-4, engagement-2/4 | OPEN: regenerate art with a clear centre, or move lettering to the lower third |
| 8 | Dark photo art with a light cover colour (dark ink, light veil) gives a milky halo behind the lettering. Passes contrast, looks smudged. | engagement-1/3/4, baby-2/3/4, graduation-2/3/4, anniversary-2, corporate-3/5, funeral-4/8/15, other-18 | OPEN: flipping tone changes the whole interior look |
| 9 | Cover kicker and date are 11 to 12px small caps; borderline for older guests. | all covers | OPEN |
| 10 | Section bands are cropped from the same cover art, so top and bottom strips repeat; no framed photo moment except the gallery. | all | OPEN |

## Near-duplicates to merge or differentiate

- Wedding 1 / 2 / 14 / 16 / 18: pale watercolour florals, same centred layout (8 and 18 differ only in flower hue).
- Corporate 1 / 2 / 4: dark table-setting photos with the same dinner copy.
- Baby 2 / 3 / 4: three beige newborn-photo covers.
- Birthday kids 3 / 5 / 6 / 13 / 14: same pastel kids template.
- Graduation 1 / 2 / 4: the same group in gowns on a lawn.

## Per-category table

| Category | Designs | Hierarchy | Legibility | Cover to interior | Tone fit | Notes |
|---|---|---|---|---|---|---|
| Wedding | 19 | Clear: names, date, button | Good; wedding-4 text lands on the groom | Colour consistent; type now matched | Good | Best variety (navy, songket, deco, floral). Near-duplicates above. |
| Engagement | 6 | Clear | engagement-5 fixed; 1/3/4 hazy | Alternating light/dark sections | Good | Hands-photo covers 1/3/4 look alike. |
| Baby | 6 | Clear | baby-5 fixed; 2/3/4 hazy | baby-5 was inverted, fixed | baby-5 was black and heavy: now soft | Wishes now baby-specific. |
| Birthday | 24 | Clear | birthday-20 fixed; kids covers clear | Good | Kids bright, adult dark gold: good | Most near-duplicates among kids themes. |
| Graduation | 4 | Clear | Names run over subjects | OK | OK | Lowest variety. |
| Anniversary | 4 | Clear | anniversary-1 fixed; name still over the couple | OK | Good | Only four; add a Malay-traditional one. |
| Corporate | 6 | Clear | corporate-1 marginal, now passes | Dark veil hides the art inside | Restrained: good | 1/2/4 too alike. |
| Festive | 5 | Clear | festive-4 fixed | Good; Raya, CNY, Deepavali, Christmas distinct | Good | Strongest art; open-house copy is the same across all. |
| Other | 20 | Clear | Good | Good | Good | Mixed set (khatam, housewarming, gender reveal, launch) fits well. |
| Funeral (hidden) | 17 | Quiet | funeral-6 fixed (was faint on pale art) | OK | Quiet: good | Stays hidden by default. |

## Needs a CEO choice

1. Text over faces on photo covers (item 7): regenerate art, or move lettering to the lower third.
2. Dark-photo designs (item 8): keep the light milky cover, or switch to a dark cover with light ink (changes the whole interior colour).
3. How much per-design variety to invest in (item 6): unique story and programme copy, and 2 to 3 section variants per category.

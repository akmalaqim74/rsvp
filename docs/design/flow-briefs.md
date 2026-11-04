# Gemini Flow briefs: art for the invitation cards

_Rule (CEO): no AI slop. All icons, images and video come from Gemini Flow, made by the CEO. Claude builds with type, borders and CSS only. The cards already look finished without any art; the art below only lifts them._

## How the art plugs in
Drop a file into `public/art/` with the exact name below. The cards use it automatically, nothing else to change. If a file is missing, the card shows its clean CSS/SVG fallback, so you can add art one category at a time.

| File | Where it shows | Size and format |
|---|---|---|
| `corner-<category>.webp` | Four corners of the cover doors and the first inside section. **Draw only the top-left corner**; the code mirrors it for the other three | Transparent **WebP, 600 x 600 px**, ornament touching the top-left edges, leave about 10 percent clear margin |
| `divider-<category>.webp` | Thin ornament between sections | Transparent **WebP, 900 x 120 px**, centred, lots of empty space either side |
| `seal-<category>.webp` | The round seal at the bottom of the cover. **No letters on it**; the monogram is added by code so one seal fits every design | Transparent **WebP, 400 x 400 px**, a round or slightly irregular disc, top-lit |
| `hero-card.webp` (optional, not wired yet) | A phone mock-up of a finished card for the hero, if you want it instead of the CSS phone | **WebP, 900 x 1600 px** |

`<category>` is one of `wedding`, `birthday`, `funeral` (this is Tahlil), `other`. One file set per category is enough to start; every design in that category shares it.

Export tips: transparent background, no drop shadow baked in (the page adds its own), no text anywhere in the image, keep each file under 80 KB (WebP quality about 80).

## Style rules for every prompt
- Flat or lightly engraved line art, **no photorealism, no 3D render, no glossy gradients, no glitter, no cartoon faces**.
- No text, letters, numbers, logos or watermarks in the image.
- Limit to the palette given; thin strokes (about 1.5 to 3 px at 600 px).
- Calm and elegant. If it looks busy, ask Flow for "simpler, fewer elements, more empty space".

## Palettes per category
| Category | Line colour (art) | Matches the card |
|---|---|---|
| wedding | muted gold `#C9A96B`, with sage `#8FA39A` leaves | Sage and Gold (also works on Navy) |
| wedding, Blush Rose variant | dusty rose `#A8605F` | Blush Rose |
| birthday | warm peach `#F0C79B` on terracotta, champagne `#D8BC8A` on plum | Warm Terracotta, Plum |
| funeral (Tahlil) | pale sage `#A9BDB3` or slate `#B2BDC8`, very thin | Quiet Green, Soft Slate |
| other | pale ink-blue `#9DB0DA` | Ink Blue, Dusty Blue |

Because the art sits on dark covers and light paper, ask for the **line colour only on a transparent background**, then check it on both. If one file must work on both, use the gold or a mid tone.

---

## Prompts (paste into Flow)

### 1. Corner floral, wedding (`corner-wedding.webp`)
> A single top-left corner ornament for a wedding invitation border, delicate fine-line botanical drawing: a few olive branches and small leaves curving along both edges from the top-left corner, with two or three tiny buds. Muted gold line art (#C9A96B) on a fully transparent background, flat engraved style, thin consistent strokes, lots of empty space, elegant and restrained. No text, no shadow, no photorealism, no colour fill. Square canvas 600 x 600 px, the artwork anchored to the top-left corner.

### 2. Corner, birthday (`corner-birthday.webp`)
> A single top-left corner ornament for a refined birthday invitation: simple geometric line corner with a quarter-circle fan of three concentric arcs and a small diamond, plus two tiny leaf sprigs. Warm champagne line (#D8BC8A) on a fully transparent background, flat line art, thin strokes, minimal and grown-up, not childish. No balloons, no confetti, no cartoon, no text. Square canvas 600 x 600 px, anchored to the top-left.

### 3. Corner, Tahlil (`corner-funeral.webp`) (keep it very quiet)
> A single top-left corner ornament for a respectful Islamic memorial (tahlil) invitation: extremely simple, two thin parallel lines that meet at the corner with one small, plain geometric eight-point star motif or a single thin curved leaf. Pale sage line (#A9BDB3) on a fully transparent background, very thin strokes, a lot of empty space, solemn and calm. No flowers in colour, no skulls, no crosses, no decorative flourishes, no text, no shadow. Square canvas 600 x 600 px, anchored to the top-left.

### 4. Corner, other (`corner-other.webp`)
> A single top-left corner ornament for a formal event invitation (company dinner, aqiqah): clean art-deco style, three thin stepped lines forming a corner with a tiny diamond at the point. Pale ink-blue line (#9DB0DA) on a fully transparent background, flat, thin strokes, minimal. No text, no shadow, no gradients. Square canvas 600 x 600 px, anchored to the top-left.

### 5. Divider (`divider-<category>.webp`)
> A thin horizontal ornamental divider for an invitation, centred: a hairline that fades toward both ends, with a small refined motif in the middle (two mirrored leaves with a tiny diamond for wedding and other; just a tiny diamond for Tahlil). One line colour, transparent background, no text, no shadow, flat. Canvas 900 x 120 px, artwork centred with large empty margins left and right.

Use the category colour from the palette table. For Tahlil keep it just the hairline and one diamond.

### 6. Wax seal (`seal-<category>.webp`)
> A round wax seal blank, seen from the front and lit softly from the top-left, with a slightly irregular edge and a thin raised inner ring, **no letters, no symbols, no text in the middle** (the centre must stay flat and empty so a monogram can be added). Matte, realistic wax texture, a single flat colour family: deep gold (#C9A96B) for wedding and other, burgundy (#8A2F3F) as an alternative wedding colour, cream (#FFF3E2) for birthday. Fully transparent background, no cast shadow outside the seal. Square canvas 400 x 400 px, seal centred and filling about 90 percent of the canvas.

Not needed for Tahlil: that design uses a quiet ring, not a wax seal.

### 7. Hero card mock (optional, `hero-card.webp`)
> A photograph-style mock-up of a smartphone held upright at a slight angle, on a soft warm ivory background, showing a digital wedding invitation cover on screen: dark sage green paper doors with a thin gold double border, wide-spaced capital serif lettering, a gold wax seal in the centre. Placeholder lettering only, nothing readable. Soft natural light, shallow depth of field, calm and premium, no hands with distorted fingers, no logos, no text overlays. Portrait 900 x 1600 px.

---

## Checking the art (Claude does this after you drop files)
1. Reload any sample at 375 px. If a file is missing or broken the fallback shows, so nothing breaks.
2. Check it on both a dark cover and a light paper section, and in the gallery thumbnail (the corner is shown very small there).
3. If an image is too heavy or too busy, ask Flow for "simpler, thinner lines, more empty space" and swap the file.

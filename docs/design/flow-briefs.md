# Gemini Flow briefs: art for the invitation cards

_Rule (CEO): no AI slop. All icons, images and video come from Gemini Flow, made by the CEO. Claude builds with type, borders and CSS only. The cards already look finished without any art; the art below only lifts them._

## How the art plugs in
Weddings are no longer green by default: the lead design is ivory paper with gold and blush. Drop a file into `public/art/` with the exact name below. The cards use it automatically, nothing else to change. If a file is missing, the card shows its clean CSS/SVG fallback, so you can add art one category at a time.

| File | Where it shows | Size and format |
|---|---|---|
| `corner-<category>-tl.webp` and `corner-<category>-br.webp` | Large botanical corners of the cover (and the first inside page), like a printed card: top-left and bottom-right. **The two files may differ** (the code does not mirror them). Shown at about 35 to 45 percent of the card width | Transparent **WebP, 800 x 800 px** each, artwork anchored to its own corner (top-left for `-tl`, bottom-right for `-br`), tapering toward the centre with soft edges, about 10 percent clear margin. Either file may be missing (a small geometric corner shows in its place) |
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
| wedding | muted gold `#B8935A` with dusty-rose `#C98B8F` blossoms and a little sage-grey leaf `#8FA39A` | Ivory and Gold (lead design, light cover), Blush Rose; use `#C9A96B` gold on Midnight Navy |
| wedding, Blush Rose variant | dusty rose `#A8605F` | Blush Rose |
| birthday | warm peach `#F0C79B` on terracotta, champagne `#D8BC8A` on plum | Warm Terracotta, Plum |
| funeral (Tahlil) | pale sage `#A9BDB3` or slate `#B2BDC8`, very thin | Quiet Green, Soft Slate |
| other | pale ink-blue `#9DB0DA` | Ink Blue, Dusty Blue |

Because the art sits on dark covers and light paper, ask for the **line colour only on a transparent background**, then check it on both. If one file must work on both, use the gold or a mid tone.

---

## Prompts (paste into Flow)

### 1. Corner floral, wedding (`corner-wedding-tl.webp`, then `corner-wedding-br.webp`)
> A single top-left corner ornament for a wedding invitation border, delicate fine-line botanical drawing: a few olive branches and small leaves curving along both edges from the top-left corner, with two or three tiny buds. Muted gold line art (#C9A96B) on a fully transparent background, flat engraved style, thin consistent strokes, lots of empty space, elegant and restrained. No text, no shadow, no photorealism, no colour fill. Square canvas 800 x 800 px, the artwork anchored to the top-left corner, fading softly toward the centre. For `-br`, the same style anchored to the bottom-right with a slightly different arrangement.

### 2. Corner, birthday (`corner-birthday-tl.webp` / `-br.webp`)
> A single top-left corner ornament for a refined birthday invitation: simple geometric line corner with a quarter-circle fan of three concentric arcs and a small diamond, plus two tiny leaf sprigs. Warm champagne line (#D8BC8A) on a fully transparent background, flat line art, thin strokes, minimal and grown-up, not childish. No balloons, no confetti, no cartoon, no text. Square canvas 800 x 800 px, anchored to the top-left (or bottom-right for `-br`).

### 3. Corner, Tahlil (`corner-funeral-tl.webp` / `-br.webp`) (keep it very quiet)
> A single top-left corner ornament for a respectful Islamic memorial (tahlil) invitation: extremely simple, two thin parallel lines that meet at the corner with one small, plain geometric eight-point star motif or a single thin curved leaf. Pale sage line (#A9BDB3) on a fully transparent background, very thin strokes, a lot of empty space, solemn and calm. No flowers in colour, no skulls, no crosses, no decorative flourishes, no text, no shadow. Square canvas 800 x 800 px, anchored to the top-left (or bottom-right for `-br`).

### 4. Corner, other (`corner-other-tl.webp` / `-br.webp`)
> A single top-left corner ornament for a formal event invitation (company dinner, aqiqah): clean art-deco style, three thin stepped lines forming a corner with a tiny diamond at the point. Pale ink-blue line (#9DB0DA) on a fully transparent background, flat, thin strokes, minimal. No text, no shadow, no gradients. Square canvas 800 x 800 px, anchored to the top-left (or bottom-right for `-br`).

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

---

## Video and animated assets (made in Flow, not by Claude)
Rule (CEO): any video or animation asset comes from Google Flow. Claude only builds the opening and motion in code (doors, seal, fades). The loop below is optional and does nothing until the file exists.

| File | Where it shows | Format |
|---|---|---|
| `loop-<category>.webm` | Soft looping background behind the cover lettering (animated florals, drifting light, shimmer) | **WebM (VP9), 720 x 1280 px portrait, 6 to 8 seconds, seamless loop, no audio track**, 24 fps, **under 400 KB** (about 400 kbps), no alpha needed (the page shows it at 35 percent opacity over the cover colour) |

It is skipped automatically for visitors with reduced motion or data saver on, and when the file is missing. Category names as above (`wedding`, `birthday`, `funeral`, `other`). **Tahlil: do not make one**; that card stays still.

Other ideas, **not wired**, brief only if you want them later (tell Claude and a slot will be added):
- Seal-stamp clip (seal pressing into the cover): transparent WebM, 400 x 400, 1.5 s, plays once, under 150 KB.
- Soft confetti or petals falling when the doors open (wedding, birthday only): transparent WebM, 720 x 1280, 3 s, plays once, under 300 KB.

### Prompt: cover loop, wedding
> A slow, seamless looping background animation for a wedding invitation cover, portrait 9:16: very fine gold line botanical sprigs gently swaying and tiny gold light specks drifting upward on a flat dark sage green (#2F4A3F) background. Subtle, calm, low contrast, large empty centre so text can sit on top. No text, no people, no faces, no camera movement, no flashing. Exactly 6 seconds, the last frame matches the first so it loops without a jump. 720 x 1280, 24 fps.

### Prompt: cover loop, birthday
> A slow seamless looping background animation for a refined birthday invitation cover, portrait 9:16: soft champagne light specks and thin gold arcs drifting gently on a deep plum (#3E2A3F) background. Calm and grown-up, low contrast, empty centre for text. No balloons, no cartoon, no text, no flashing, no camera movement. 6 seconds, first frame equals last frame for a perfect loop. 720 x 1280, 24 fps.

### Prompt: cover loop, other
> A slow seamless looping background animation for a formal event invitation cover, portrait 9:16: faint pale-blue geometric lines slowly shimmering on deep ink-blue (#1B2A4E). Minimal, low contrast, empty centre for text. No text, no people, no flashing, no camera movement. 6 seconds, perfect loop. 720 x 1280, 24 fps.

Compress after export (for example HandBrake or `ffmpeg -c:v libvpx-vp9 -b:v 400k -an`) and check the file is under the size above; heavy clips hurt phones.

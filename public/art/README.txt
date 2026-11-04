Optional art slots (made in Gemini Flow). Drop a file here and the invitation cards use it
automatically; if a file is missing the cards show a clean CSS/SVG fallback.

Names (category = wedding | birthday | funeral | other):
  corner-<category>-tl.webp  large corner, top-left, transparent WebP 800x800. Shown at about 40% of the card width.
  corner-<category>-br.webp  large corner, bottom-right, transparent WebP 800x800. May differ from -tl (not mirrored).
  divider-<category>.webp    thin horizontal divider between pages, transparent WebP 900x120.
  seal-<category>.webp       wax seal without letters, transparent WebP 400x400. The monogram is added by CSS.
  portrait-couple.webp       wedding "Portrait Doors" cover: ONE 720x1280 photo, groom cut by the left edge, bride by the right, plain light centre, faces in the lower half. Split down the middle across the two doors. Labelled "Sample photo"; a customer supplies their own. Missing: a quiet tonal panel shows.
  gallery-<category>-<n>.webp  gallery photos n=1..6 (wedding), 4:5, 800x1000 WebP. Missing: a plain neutral tile with no text.
  loop-<category>.webm       optional cover background loop, 720x1280, 6 s, under 400 KB, no audio.
Full specs and prompts: docs/design/flow-briefs.md

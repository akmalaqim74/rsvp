Optional art slots (made in Gemini Flow). Drop a file here and the invitation cards use it
automatically; if a file is missing the cards show a clean CSS/SVG fallback.

Names (category = wedding | birthday | funeral | other):
  corner-<category>-tl.webp  large corner, top-left, transparent WebP 800x800. Shown at about 40% of the card width.
  corner-<category>-br.webp  large corner, bottom-right, transparent WebP 800x800. May differ from -tl (not mirrored).
  divider-<category>.webp    thin horizontal divider between pages, transparent WebP 900x120.
  seal-<category>.webp       wax seal without letters, transparent WebP 400x400. The monogram is added by CSS.
  portrait-groom.webp / portrait-bride.webp  wedding "Portrait Doors" cover only (left door = groom, right = bride). 720x1280 portrait WebP, under 120 KB each, face right of centre. Placeholders: shown labelled "Sample photo"; a customer supplies their own. Either may be missing (quiet "Your photo" panel shows).
  loop-<category>.webm       optional cover background loop, 720x1280, 6 s, under 400 KB, no audio.
Full specs and prompts: docs/design/flow-briefs.md

# Design tokens — "Warm Ivory & Ink"

Direction: calm, trustworthy, event-neutral. It must feel right next to a birthday and next to a funeral, so no confetti, no gold-and-roses wedding look. Warm paper background, deep ink-blue text, one terracotta accent for the single primary action. All tokens live in one `:root` block so the CEO's brand (when it arrives from Config or later) can re-theme by editing values.

## Colors (AA contrast pairs to be verified in review)
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FBF8F2` | page background |
| `--surface` | `#FFFFFF` | cards, form |
| `--ink` | `#1B2A41` | body and headings (about 13:1 on bg) |
| `--muted` | `#4F5B6E` | secondary text (about 6.5:1 on bg) |
| `--accent` | `#B4532A` | primary buttons; white text on it about 5.3:1 |
| `--accent-soft` | `#F3E3D9` | highlights, step numbers |
| `--wa` | `#128C4B` | WhatsApp button; white text about 4.7:1 |
| `--line` | `#E4DDD0` | borders, dividers |
| `--error` | `#9B2C2C` | form errors |
| `--dark` | `#1B2A41` | footer and final CTA band, text `#FBF8F2` |

## Type
- Headings: **Fraunces** 600, fallback `Georgia, serif`. Body and UI: **Inter** 400/500, fallback `system-ui, sans-serif`.
- Mobile scale: hero 36px, section 26px, body 16px (inputs 16px so iOS does not zoom), small 14px. Line height 1.5 body, 1.15 headings.
- Self-host the two fonts (woff2, latin subset) to avoid a third-party request.

## Spacing and shape
- Spacing 4, 8, 16, 24, 32, 48, 72. Gutter 20px. Content max width 1040px; text blocks 640px.
- Radius: cards 16px, buttons and inputs 12px.
- One soft shadow: `0 6px 20px rgba(27,42,65,.10)`.

## Interaction
- Tap targets at least 48px. Focus ring 3px `--accent` with 2px offset.
- Motion: gentle fade-up on scroll, 300ms. `prefers-reduced-motion`: none.
- Language switch is a two-button toggle (BM / EN), always visible in the header, remembered in `localStorage`.

## Assets
- Event-type previews are simple CSS/SVG cards we draw (no stock photos in v1). Sample names and dates are labelled "Sample".
- Logo: from Config `logo_url`; if empty, show the product name as text in Fraunces.

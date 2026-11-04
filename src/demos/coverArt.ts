/* Designs that have full-bleed cover art in public/art/cover-<category>-<n>.webp. Known synchronously so the
   cover paints the art from the first frame (no flat-then-art swap). tests/cover-art.test.cjs fails if this
   list and the folder disagree: add the key here when a file is dropped in. */
export const COVER_ART: ReadonlySet<string> = new Set([
  'wedding-2', 'wedding-3', 'wedding-5', 'wedding-6', 'wedding-7', 'wedding-8',
  'birthday-1', 'birthday-2', 'birthday-3', 'birthday-4',
  'other-1', 'other-2', 'other-3', 'other-4'
]);

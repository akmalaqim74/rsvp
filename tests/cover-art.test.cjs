const assert = require('assert');
const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(path.join(__dirname, '../public/art')).filter((f) => /^cover-.+\.webp$/.test(f)).map((f) => f.slice(6, -5)).sort();
const src = fs.readFileSync(path.join(__dirname, '../src/demos/coverArt.ts'), 'utf8');
const listed = [...src.matchAll(/'([a-z]+-\d+)'/g)].map((m) => m[1]).sort();
assert.deepStrictEqual(listed, files, 'src/demos/coverArt.ts must list exactly the cover-*.webp files in public/art');
console.log('ok - cover art list matches public/art (' + files.length + ')');

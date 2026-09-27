// Fetch typefaces from Google Fonts into src/fonts and write src/styles/fonts.generated.css.
//
//   npm run fonts -- "Cormorant Garamond:ital,wght@0,300..700;1,300..700" "Fraunces:ital,opsz,wght@0,9..144,100..900"
//
// Each argument is a Google Fonts family spec (the part after "family=" in a fonts.googleapis.com URL).
// Afterwards, point --text / --display / --sans in src/styles/theme.css at the family names and run npm run build.
// The default faces in src/fonts (EB Garamond, Instrument Serif, Instrument Sans) stay available.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = path.join(ROOT, 'src', 'fonts');
const OUT = path.join(ROOT, 'src', 'styles', 'fonts.generated.css');

const specs = process.argv.slice(2);
if (!specs.length) {
  console.error('usage: npm run fonts -- "Family:ital,wght@0,400..700;1,400" ["Other Family" …]');
  process.exit(1);
}

// A plain user agent makes the API return one TrueType file per weight/style, which Chromium embeds cleanly.
const UA = 'curl/8.0';

async function fetchCss(spec) {
  const url = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(spec).replace(/%3A/g, ':').replace(/%40/g, '@').replace(/%2C/g, ',').replace(/%3B/g, ';').replace(/%20/g, '+').replace(/%2E/g, '.') + '&display=swap';
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Google Fonts returned ${res.status} for ${spec}`);
  return res.text();
}

function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

let generated = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
for (const spec of specs) {
  const family = spec.split(':')[0];
  const css = await fetchCss(spec);
  const blocks = css.match(/@font-face\s*{[^}]*}/g) || [];
  if (!blocks.length) throw new Error(`no @font-face blocks for ${spec}`);
  const dir = path.join(FONTS, slug(family));
  fs.mkdirSync(dir, { recursive: true });
  let out = `\n/* ${family} — fetched from Google Fonts on ${new Date().toISOString().slice(0, 10)} */\n`;
  let n = 0;
  for (const block of blocks) {
    const url = /src:\s*url\(([^)]+)\)/.exec(block)?.[1];
    const style = /font-style:\s*(\w+)/.exec(block)?.[1] || 'normal';
    const weight = /font-weight:\s*([\d ]+)/.exec(block)?.[1]?.trim() || '400';
    if (!url) continue;
    const ext = path.extname(new URL(url).pathname) || '.ttf';
    const file = `${slug(family)}-${weight.replace(/\s+/g, '-')}-${style}${ext}`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`download failed ${url}`);
    fs.writeFileSync(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
    out += `@font-face { font-family: "${family}"; src: url("../fonts/${slug(family)}/${file}") format("truetype"); font-weight: ${weight}; font-style: ${style}; }\n`;
    n++;
  }
  // replace an earlier block for the same family, if any
  const marker = new RegExp(`\\n/\\* ${family.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} — fetched[\\s\\S]*?(?=\\n/\\* |$)`);
  generated = generated.replace(marker, '');
  generated += out;
  console.log(`${family}: ${n} files → src/fonts/${slug(family)}/`);
}
fs.writeFileSync(OUT, generated.trimStart());
console.log(`wrote ${path.relative(ROOT, OUT)}. Now set --text / --display / --sans in src/styles/theme.css and run npm run build.`);

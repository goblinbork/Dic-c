// Build pipeline for THE INSTRUMENT.
// Assembles the manuscript parts, pre-hyphenates prose, and renders print-ready
// PDFs with headless Chromium (Playwright) + Paged.js.
//
//   node build.mjs            -> everything
//   node build.mjs book       -> the interior only
//   node build.mjs cover cards chart letter

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

function loadPlaywright() {
  const candidates = [
    'playwright',
    '/opt/node22/lib/node_modules/playwright',
    '/usr/local/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright',
  ];
  for (const c of candidates) {
    try { return require(c); } catch { /* try next */ }
  }
  throw new Error('Playwright not found. Run: npm install');
}

const { chromium } = loadPlaywright();
const { hyphenateSync } = require('hyphen/en-us');

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

// ---------------------------------------------------------------------------
// Targets
// ---------------------------------------------------------------------------
const TARGETS = {
  book: {
    template: 'book.html',
    parts: 'parts',
    hyphenate: true,
    outputs: [
      { file: 'the-instrument.pdf', variant: 'screen' },
      { file: 'the-instrument-PRINT.pdf', variant: 'print' },
    ],
  },
  cover: {
    template: 'cover.html',
    outputs: [{ file: 'cover-case-wrap-PRINT.pdf', variant: 'print' }],
    png: { file: 'cover-front.png', selector: '#front-preview', scale: 2 },
  },
  cards: {
    template: 'cards.html',
    hyphenate: true,
    outputs: [{ file: 'twelve-cards-PRINT.pdf', variant: 'print' }],
    png: { file: 'card-preview.png', selector: '#card-preview', scale: 2 },
  },
  chart: {
    template: 'chart.html',
    outputs: [{ file: 'weeks-chart-PRINT.pdf', variant: 'print' }],
    png: { file: 'weeks-chart-preview.png', selector: '#chart-preview', scale: 1 },
  },
  letter: {
    template: 'letter.html',
    hyphenate: true,
    outputs: [{ file: 'sealed-letter-PRINT.pdf', variant: 'print' }],
  },
};

// ---------------------------------------------------------------------------
// Hyphenation: headless Chromium ships no hyphenation dictionaries, so we
// insert soft hyphens into prose text nodes before layout. Headings, code,
// SVG and anything marked class="nohyph" are left untouched.
// ---------------------------------------------------------------------------
const NO_HYPH_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'script', 'style', 'pre', 'code', 'svg', 'title', 'textarea', 'table']);
const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'wbr', 'col', 'path', 'circle', 'line', 'rect', 'use', 'polyline', 'polygon']);

function hyphenateHtml(html) {
  const tokens = html.split(/(<[^>]+>)/g);
  const stack = []; // {tag, excluded}
  let out = '';
  for (const tok of tokens) {
    if (tok.startsWith('<')) {
      out += tok;
      if (tok.startsWith('<!--') || tok.startsWith('<!')) continue;
      const m = /^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(tok);
      if (!m) continue;
      const tag = m[1].toLowerCase();
      if (tok.startsWith('</')) {
        const idx = stack.map(s => s.tag).lastIndexOf(tag);
        if (idx >= 0) stack.length = idx;
        continue;
      }
      if (VOID_TAGS.has(tag) || tok.endsWith('/>')) continue;
      const parentExcluded = stack.length ? stack[stack.length - 1].excluded : false;
      const excluded = parentExcluded || NO_HYPH_TAGS.has(tag) || /class="[^"]*\b(nohyph|sc|pull|axiom|epi|kicker|foot|label|time|date|q|edition|press|subtitle|who|part|numeral|signoff|t|n|pg)\b[^"]*"/.test(tok);
      stack.push({ tag, excluded });
      continue;
    }
    const excluded = stack.length ? stack[stack.length - 1].excluded : false;
    if (excluded || !/[A-Za-z]{6,}/.test(tok)) { out += tok; continue; }
    // protect entities such as &rsquo;
    out += tok.split(/(&[a-zA-Z#0-9]+;)/g).map((seg, i) => (i % 2 === 1 ? seg : hyphenateSync(seg, { minWordLength: 6 }))).join('');
  }
  return out;
}

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------
function assemble(target, variant) {
  const t = TARGETS[target];
  let html = fs.readFileSync(path.join(SRC, t.template), 'utf8');
  if (t.parts) {
    const dir = path.join(SRC, t.parts);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();
    const body = files.map(f => `<!-- part: ${f} -->\n` + fs.readFileSync(path.join(dir, f), 'utf8')).join('\n\n');
    html = html.replace('<!-- PARTS -->', body);
  }
  if (t.hyphenate) html = hyphenateHtml(html);
  html = html.replace('<body', `<body data-variant="${variant}"`);
  if (variant === 'print') {
    html = html.replace('</head>', '<style id="print-variant">@page { bleed: 3mm; marks: crop cross; }</style>\n</head>');
  }
  const outFile = path.join(SRC, `_${target}.${variant}.html`);
  fs.writeFileSync(outFile, html);
  return outFile;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
async function render(browser, target) {
  const t = TARGETS[target];
  fs.mkdirSync(DIST, { recursive: true });
  for (const out of t.outputs) {
    const file = assemble(target, out.variant);
    const page = await browser.newPage();
    page.on('pageerror', e => console.error(`  [page error] ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error(`  [console] ${m.text()}`); });
    await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__renderDone === true, null, { timeout: 180000 });
    const pages = await page.evaluate(() => window.__pageCount ?? null);
    const dest = path.join(DIST, out.file);
    await page.pdf({ path: dest, printBackground: true, preferCSSPageSize: true });
    console.log(`  ${out.file}${pages ? `  (${pages} pages)` : ''}`);
    if (t.parts && out === t.outputs[0]) await pageMap(page);
    if (t.png && out === t.outputs[0]) {
      const el = await page.$(t.png.selector);
      if (el) {
        await el.screenshot({ path: path.join(DIST, t.png.file), scale: 'css', type: 'png' });
        console.log(`  ${t.png.file}`);
      }
    }
    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Page map: reads the paginated DOM and reports what landed on each page, so a
// chapter that drifts off its six-page rhythm (opener | essay · essay | essay ·
// practice | ledger) shows up immediately as a blank or a misplaced page.
// ---------------------------------------------------------------------------
async function pageMap(page) {
  const rows = await page.evaluate(() => {
    const kinds = [['.opener', 'OPENER'], ['.practice', 'practice'], ['.ledger', 'ledger'], ['.half-title', 'half-title'], ['.title-page', 'title'], ['.copyright', 'copyright'], ['.dedication', 'dedication'], ['.epigraph-page', 'epigraph'], ['.contents', 'contents'], ['.testpage', 'test'], ['.howto', 'before you begin'], ['.theset', 'the set'], ['.yearplan', 'the year'], ['.after', 'after the year'], ['.vowtext', 'vow (text)'], ['.vow', 'vow (form)'], ['.axioms', 'axioms'], ['.sources', 'sources'], ['.glossary', 'vocabulary'], ['.acks', 'acknowledgments'], ['.colophon', 'colophon'], ['.essay', 'essay']];
    return Array.from(document.querySelectorAll('.pagedjs_page')).map((pg, i) => {
      const area = pg.querySelector('.pagedjs_page_content');
      const text = (area?.innerText || '').replace(/\s+/g, ' ').trim();
      let kind = text ? 'text' : 'BLANK';
      for (const [sel, name] of kinds) { if (area?.querySelector(sel)) { kind = name; break; } }
      return { n: i + 1, side: (i + 1) % 2 ? 'R' : 'V', kind, head: text.slice(0, 48) };
    });
  });
  const blanks = rows.filter(r => r.kind === 'BLANK').map(r => r.n);
  console.log('  page map:');
  for (const r of rows) console.log(`    ${String(r.n).padStart(3)} ${r.side} ${r.kind.padEnd(16)} ${r.head}`);
  console.log(`  ${rows.length} pages; blank: ${blanks.length ? blanks.join(', ') : 'none'}`);
  const openers = rows.filter(r => r.kind === 'OPENER');
  const drift = openers.filter((r, i) => (r.n - openers[0].n) !== i * 6 || r.side !== 'V');
  if (drift.length) console.log(`  WARNING: chapters off the six-page rhythm at pages ${drift.map(r => r.n).join(', ')}`);
  if (rows.length % 16) console.log(`  WARNING: ${rows.length} pages is not a multiple of 16 (signatures)`);
}

async function main() {
  const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TARGETS);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  try {
    for (const target of wanted) {
      if (!TARGETS[target]) { console.error(`unknown target: ${target}`); process.exitCode = 1; continue; }
      if (!fs.existsSync(path.join(SRC, TARGETS[target].template))) { console.log(`skip ${target} (no ${TARGETS[target].template})`); continue; }
      console.log(`building ${target}…`);
      await render(browser, target);
    }
  } finally {
    await browser.close();
  }
}

main().catch(e => { console.error(e); process.exit(1); });

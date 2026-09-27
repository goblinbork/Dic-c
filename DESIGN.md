# DESIGN.md — the design system

The book should look like nothing else on the shelf and like one thing throughout: a **catalogue of instruments**. The identity is built from four decisions, and everything else follows from them.

## 1. The four decisions

1. **Two inks.** Black and one spot colour, cinnabar (`--spot`, ≈ Pantone 1805 C). Nothing is full colour. The restraint is the luxury; the red is spent only where it means something: numerals, rules, the plates' emphasis, the practice checkboxes, the ledger rules.
2. **Three typefaces, three jobs.** A text face for reading, a display face for names and numerals, a sans for the working parts (labels, tables, ledgers, running heads, plates). The reader can tell from the typeface alone whether a page is to be read, admired or written on.
3. **One rhythm.** Every chapter is six pages in the same order, so the book teaches its own use by page three. Openers are always on the left; ledgers are always on the right, facing their practice.
4. **A plate on every opener.** A technical drawing of the instrument in hairlines and spot colour, captioned like a figure in a manual. This is the visual signature: no stock illustration, no photographs, no decoration that does not explain something.

## 2. Type

| Role | Face | Size / leading | Notes |
|---|---|---|---|
| Running text | EB Garamond (variable, weight 470) | 11 / 16 pt | Old-style numerals, ligatures. Justified with soft-hyphen pre-hyphenation. |
| Opening words | EB Garamond small caps | — | The first three to five words of each essay, `<span class="sc">`. |
| Display | Instrument Serif | numeral 132 pt; names 36 pt; page titles 22 pt; pull quotes 17 / 22 pt | Regular only. Never letterspaced except on the title page and cover. |
| Working | Instrument Sans (variable) | labels 7–7.5 pt, letterspaced 0.14–0.18 em, uppercase; tables 8.5 pt; ledger prompts italic text face 10.5 pt | Weight 500 for labels, 600 for emphasis. |
| Plates | Instrument Sans inside SVG | 3.2–4.4 viewBox units (≈ 5–7 pt) | Set by `.opener .plate svg text` in `book.css`. |

To change the faces: edit `--text`, `--display`, `--sans` in `book/src/styles/theme.css`. To add faces, `npm run fonts -- "Family:…"` (see `CLAUDE.md`) or place files in `src/fonts` and declare them in `fonts.css`. After a font change, rebuild and read the page map: the essays are tuned to fill three pages in EB Garamond at 11/16; a wider face needs either a smaller `--body-size` or trimmed text.

## 3. Colour

| Token | Value | Use |
|---|---|---|
| `--ink` | #000000 | text, rules, plate lines |
| `--spot` | #B3261E | numerals, labels, emphasis, checkboxes, the needle |
| `--spot-30` | #E8B9B4 | ledger rules, table rules, grids, plate tints |
| `--spot-12` | #F6E3E0 | plate shading |
| `--grey` | #6b6b6b | captions, prompts, secondary labels (60 % black) |
| `--paper-screen` | #FBF8F1 | screen proof only; print pages are white |
| `--cloth` / `--foil` | #1B2233 / #B87333 | the case: deep ink cloth, copper foil |

Prepress maps `--ink` to K 100 and `--spot` plus its tints to the spot plate.

## 4. Page geometry

Trim 170 × 240 mm. Text block 118 × 192 mm. Inner margin 22 mm, outer 30 mm (room for the owner's marginalia), top 22 mm, bottom 26 mm. Running heads sit 6 mm above the text block at the outer edge: "The Instrument" on versos, the chapter name on rectos. Folios at the outer edge below the block. Openers, the year plan, the vow form, the axioms, the vocabulary, acknowledgments and the colophon carry neither.

## 5. Elements

- **Opener** (`.opener`): kicker (instrument number and domain), numeral, name, axiom (italic), plate with caption, epigraph with attribution, month.
- **Essay** (`.essay`): opening paragraphs; `h2` section labels *Why it works* and *How to hold it* with a short spot-colour rule; one `.pull` quote; optional table; a `.te` thought experiment box closing the essay on page three.
- **Practice** (`.practice`): label, title, time line, numbered steps with a checkbox square, *Why it works*, *Where it fails*.
- **Ledger** (`.ledger`): label, title, date line, prompt fields with ruled lines or grids, a sign-off row (Signed / Reviewed on / Kept–Revised).
- **Plates** (`.plate`): SVG, viewBox 200 × 110, rendered 100 mm wide. Strokes: axes 0.5, curves 0.9, leaders 0.3. Text sizes 3.2 (axis captions, uppercase, grey), 3.6–3.8 (labels), 4.0–4.4 (the one thing to notice, often in spot). Shaded regions use `--spot-12`. Every caption starts with the plate number in spot small caps and ends with a source or the word "schematic".
- **Thought experiment** (`.te`): a spot rule, a label, one paragraph in 9.75 pt, always a scenario with a question and a turn at the end.
- **Tables** (`.essay table`): sans, hairline rules, uppercase spot column heads, right-aligned figures.

## 6. The companion pieces

- **Cover**: deep ink cloth, copper foil, the dial mark blind-debossed with the needle in foil. Title in Instrument Serif caps letterspaced 0.22 em. `cover.html` renders both a mockup sheet and the stamping artwork (black = foil, magenta = deboss).
- **Cards**: A6, same hierarchy as the opener on the front (kicker, numeral, name, axiom), the practice in brief on the back with checkboxes. Letterpress, two colours.
- **Chart**: A2, 52 × 90 grid of 4.8 mm boxes in the 30 % tint, the eightieth year marked with a dashed spot rule, an allocation panel top right.
- **Letter**: four A5 pages; numeral XIII, the same voice, one quotation at the end.
- **The mark**: a dial with twelve divisions and a needle set to the first. It appears on the title page, the cover, the spine, the cards and the seal. Draw it from the SVG in `00-front.html`; do not redraw it by eye.

## 7. What not to do

No drop caps, no ornaments, no photographs, no full-bleed colour, no icons, no gradients in print, no third colour, no second display face, no centred body text, no widows on ledger pages. If a page needs decorating, the page is wrong.

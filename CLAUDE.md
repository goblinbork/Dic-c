# CLAUDE.md — working notes for this repository

This repository is a book: **THE INSTRUMENT — Twelve tools for a life of your own making**, a 96-page limited edition (500 numbered copies, USD 250) with a boxed set of companion pieces. Everything here exists to produce print-ready files and to let the publisher change text, fonts and colours and re-render the whole set. Read this file before touching anything.

## What the book is

- A book built to be **used, not read**: twelve instruments, one a month; each has a twenty-minute chapter, a practice done by hand within the first week, and a ledger page the owner writes on and signs.
- The intellectual position is stated in the front matter: most books do not work (Matuschak); this one is short, spaced, written on, numbered, signed and expensive on purpose.
- Every claim rests on named research, listed in **Notes & Sources** with what it does *not* prove. Stories are labelled as stories. Nothing is fabricated. Two fashionable ideas (grit, growth mindset) are excluded deliberately, with the meta-analyses that say why.
- The book has its own vocabulary (see the Vocabulary page): governing lines, the column, the fifty, the kill criterion, the asymmetry sort, loop length, the thousand minutes, the flat part, the gap, the bridge, the four, the five, the small turn. Use these terms consistently; do not invent synonyms.

## Non-negotiable structure

The page count and rhythm are enforced by the build and must not drift:

| Pages | Content |
|---|---|
| 1–11 | Front matter: half-title, blank, title, copyright, dedication, epigraph (verso), contents (one page), a test first (verso), before you begin (two pages), the set (recto) |
| 12–83 | Twelve chapters, **exactly six pages each**: opener (verso) \| essay p1 · essay p2 \| essay p3 · practice (verso) \| ledger (recto) |
| 84–85 | The Year (plan, verso) \| After the year (conclusion, recto) |
| 86–87 | The Vow text (verso) \| The Vow form (recto) |
| 88 | The Twelve Axioms |
| 89–93 | Notes & Sources (five pages) |
| 94–96 | The Vocabulary, Acknowledgments, Colophon (last verso) |

Rules that follow from this:
- An **essay must fill exactly three pages**, with the third page at least half full (about 14–22 of 34 lines). Too short: a blank page appears before the practice. Too long: the practice is pushed and the whole book shifts. The build prints a page map and warns.
- A **practice page must fit one page**; a **ledger page must fit one page**.
- The total must be a **multiple of 16** (signatures). Currently 96.
- Paged.js keeps **one selector per `string-set` name**: all running-head sources live in one CSS rule (`.chapter h1, .plainpage h1`). Do not add a second rule.
- Paged.js can **drop a `break-before` between two consecutive sections that share a named page** (it happened between the Vocabulary and the Acknowledgments). Every back-matter section therefore has its own `@page` name (`yearplan`, `vocab`, `acks`, `colophon`); a change of page name always forces a break. Keep that pattern when adding a section.
- Flex and grid containers **cannot be split across pages**; Paged.js moves them whole to the next page. Anything laid out with `display: flex/grid` (the Vocabulary columns, the year table's neighbours, the vow's quarter row) must fit on one page with room to spare.

## How to build and check

```
cd book
npm install                 # once; needs Node 22 and a Chromium reachable by Playwright
npm run build               # everything → book/dist
npm run build:book          # interior only, prints the page map
npm run build:extras        # cover, cards, chart, letter
npm run fonts -- "Family:ital,wght@0,400..700;1,400"   # fetch a Google Font into src/fonts
```

The build assembles `src/parts/*.html` in filename order into `src/book.html`, inserts soft hyphens into prose (headless Chromium has no hyphenation dictionaries), renders with Paged.js, and writes `the-instrument.pdf` (screen proof, paper tint) and `the-instrument-PRINT.pdf` (bleed, crop marks). Read the page map it prints. If it warns, fix the text before doing anything else.

Chromium is launched with `--allow-file-access-from-files` because Paged.js fetches stylesheets over XHR from a `file://` origin.

## Where things live

```
book/src/styles/theme.css        fonts, colours, sizes — the only file to edit to restyle everything
book/src/styles/fonts.css        @font-face for the three default faces (OFL, in src/fonts)
book/src/styles/fonts.generated.css   written by tools/fetch-fonts.mjs; imported by theme.css
book/src/styles/book.css         interior layout: page geometry, running heads, every element
book/src/parts/NN-*.html         the manuscript, one file per section, in order
book/src/{cover,cards,chart,letter}.html   the companion pieces; each reads theme.css
book/build.mjs                   the pipeline; TARGETS at the top lists every output
book/tools/fetch-fonts.mjs       font fetcher
book/dist/                       rendered outputs (committed so the publisher can download them)
DESIGN.md                        the design system and how to change it
EDITING.md                       voice, style, citation rules, chapter anatomy, pre-build checklist
PRODUCTION.md                    manufacturing specification, materials, suppliers, BOM
README.md                        the prospectus: concept, contents, economics, launch
```

## Conventions

- British spelling (colour, organise, per cent), serial style without the Oxford comma in lists of three unless ambiguity requires it, numbers spelled out in prose, figures in tables and plates.
- No em dashes in the text; commas, colons and full stops carry the rhythm.
- Voice: plain, direct, unhurried, occasionally dry. Second person is used; first person singular is rare. No exclamation marks.
- Every factual claim added to a chapter gets a matching entry in `15-sources.html` in the same commit.
- Named tools are introduced in the essay in italics or with "call it", listed in the Vocabulary, and used on the practice page and the card.
- Chapter anatomy is fixed: opener (kicker, numeral, name, axiom, plate, epigraph, month) → essay (opening paragraphs, *Why it works*, pull quote, *How to hold it*, thought experiment) → practice (label, title, time line, five or six steps with checkboxes, *Why it works*, *Where it fails*) → ledger (label, title, date line, fields, sign-off row).
- Plates are inline SVG in a 200 × 110 viewBox, hairlines 0.3–0.9, labels 3.2–4.4 units in the sans face, spot colour for emphasis; captions credit the source and say "schematic" when the drawing is not a data plot.

## When asked to change something

1. Text: edit the part file, rebuild, read the page map, confirm the chapter is still six pages and the total is 96.
2. Fonts: `npm run fonts` (or drop files into `src/fonts` and add `@font-face` rules to `fonts.css`), then set the families in `theme.css`, rebuild everything, and check line counts on third pages: a wider face will push essays to four pages.
3. Colours: change `--spot` and its tints in `theme.css`; the print spec in `PRODUCTION.md` names the Pantone match and must be updated to agree.
4. A new chapter is not a small change: it breaks the twelve-month calendar, the cards, the chart legend, the year plan and the page count. Discuss before doing.
5. Never invent a study, a number or a quotation. If a claim cannot be sourced, cut it or label it as opinion.

## History

See `CHANGELOG.md`. The fact-check notes behind the Notes & Sources section were produced against primary sources in September 2026; the key figures are recorded in `EDITING.md`.

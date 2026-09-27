# EDITING.md — voice, rules and the pre-build checklist

## Voice

Plain, direct, unhurried, occasionally dry. Sentences carry one idea. Paragraphs end on the strongest sentence. The reader is addressed as *you* and trusted to be intelligent and busy. There is no hype, no exclamation, no promise the evidence cannot keep. The book says what a thing does, why it works, where it fails, and what to do this week.

Words the book uses: *instrument, practice, ledger, kept, revised, the column, the five, loop, bet, bankroll, plate.* Words it avoids: *journey, mindset, hack, unlock, transform, empower, secret, ultimate, game-changing.*

## Chapter anatomy (do not vary)

1. **Opener** — kicker ("Instrument seven · Focus"), numeral, name, axiom (one sentence, imperative or declarative, no more than sixteen words), plate with caption, epigraph (short, attributed with source and year), month.
2. **Essay, page one** — a concrete entry (a study, a scene, a number), the idea stated, and one paragraph saying what the instrument is for.
3. **Essay, pages two and three** — *Why it works* (mechanism and evidence, one pull quote), *How to hold it* (nuance, failure modes, the named tools), a hand-off sentence to the practice, and the thought experiment box.
4. **Practice** — five or six numbered steps, each beginning with a bold imperative; a time line ("Ninety minutes · alone · by hand · within the first seven days"); *Why it works* in two sentences; *Where it fails* in two.
5. **Ledger** — prompts that match the steps exactly; ruled lines or grids; the sign-off row.

Essay length: about 1,150–1,300 words including the thought experiment, which must leave the third page between 14 and 26 lines full. Practice: about 260–300 words. Ledger: prompts only.

## Citation rules

- Every study, number and quotation in a chapter has an entry in `book/src/parts/15-sources.html` under that chapter's heading: authors, year, title, journal or publisher, and the specific figure used.
- State what the evidence does not show when a reader might over-read it (sample, domain, replication status).
- Label stories as stories ("the story is told", "a parable") and demonstrations as demonstrations (Wiseman's newspaper).
- Quotations: short, attributed, in the standard translation, translator named in the notes.
- Never cite from memory. The figures below were verified against primary sources in September 2026; anything not on this list needs checking before use.

| Claim | Verified figure |
|---|---|
| Pink, *The Power of Regret* | World Regret Survey >16,000 regrets, 105 countries; American Regret Project 4,489 adults; inaction regrets ≈ 2:1 with age |
| Gollwitzer & Sheeran 2006 | 94 tests, >8,000 participants, d = 0.65 |
| Seligman et al. 2005 | gratitude visit: large positive change for one month; three good things: six months |
| Granovetter 1973 | of 54 who found jobs via a contact: 16.7 % often, 55.6 % occasionally, 27.8 % rarely |
| Karpicke & Roediger 2008 | ≈ 80 % vs ≈ 36 % recall after one week |
| Macnamara et al. 2014 | deliberate practice explains 26 / 21 / 18 / 4 / <1 % of variance (games, music, sports, education, professions) |
| Van Dongen et al. 2003 | 48 adults; 14 days; ≤ 6 h ≈ up to 2 nights' total deprivation; "largely unaware" |
| Erickson et al. 2011 | hippocampal volume +≈ 2 % (walking) vs −1.4 % (stretching) |
| Balban et al. 2023 | 108 completed; cyclic sighing > mindfulness for positive affect |
| Hershfield et al. 2011 | $172 vs $80 of a $1,000 windfall to retirement |
| Buehler et al. 1994 | predicted 33.9 days (48.6 worst case); actual 55.5; ≈ 30 % on time |
| Mitchell, Russo & Pennington 1989 | ≈ 30 % more reasons under prospective hindsight (Klein's wording) |
| Haynes et al. 2009 | complications 11.0 → 7.0 %; deaths 1.5 → 0.8 % |
| Flynn & Lake (Bohns) 2008 | predicted asks ≈ 2 × actual |
| Burt 2004 | brokers' ideas more likely judged valuable; better pay and promotion |
| Williamson & Feyer 2000 | 17–19 h awake ≈ BAC 0.05 % |
| Oppezzo & Schwartz 2014 | creative output +≈ 60 % walking |
| dscout 2016 | 2,617 touches/day average; 5,427 top decile |
| Harvard Study | began 1938; 268 Harvard sophomores + 456 Boston boys |
| Bezos | 2015 letter (April 2016), Type 1 / Type 2 doors; regret minimisation, Academy of Achievement, 4 May 2001 |
| Clear | 1.01^365 = 37.78 |

## Before every build

1. Spell-check the part you changed (British spelling).
2. Search the part for `—`; there should be none in running text.
3. Check that every new claim has a sources entry.
4. Rebuild the book: `npm run build:book`. Read the page map. Confirm: 96 pages; no blanks except 2 and 8; every opener on a verso six pages apart; essay third pages 14–26 lines.
5. If you changed a card's practice or an axiom, rebuild the extras: the card backs, the year plan and the axioms page must say the same thing.
6. Open `dist/the-instrument.pdf` and look at the pages you touched at 100 %.

## On disclosure

The Acknowledgments page states that the first draft was made with the help of a language model and then checked and edited by people. Keep the sentence or replace it with a truthful one. Do not remove it silently.

## Placeholders to resolve before print

- Imprint name "Dic-c Editions" (title page, copyright page, cards, letter, colophon).
- Printer, binder and letterpress studio names in the colophon.
- ISBN and the publisher's address on the copyright page.
- The register's address, if the book is to name it.

# The Boswell Sisters — Site Rebuild

Living reference for this project. Update alongside each meaningful commit so a
returning developer (or Claude session) can pick up cold without re-reading the
entire chat history. Nothing sensitive belongs in this file — no tokens, no
secrets, no private URLs. Kept in the repo, not served by the site.

**Last updated:** 2026-07-14, Music section commit.

---

## 1. What this is

A modern rebuild of **bozzies.org** — the non-profit tribute site for The
Boswell Sisters (Martha, Connee, and Vet), the New Orleans vocal harmony trio
active 1925–1936. The legacy site ran on WordPress 4.5.16 and had been frozen
at 2016 content until it was replaced by this rebuild.

**Goal:** preserve the site's editorial content, modernize the design to a
museum-editorial standard, and give the owner a CMS that lets non-technical
editors maintain it without a developer in the loop.

**Repo:** [github.com/timetomoto/boswell-poc](https://github.com/timetomoto/boswell-poc)
(originally the POC scaffold, promoted to the real repo once the CMS loop
proved out).

**Local working directory:** `/Users/keithhalpin/boswell-poc`

---

## 2. Tech stack

| Piece | Choice | Why |
|---|---|---|
| Static site generator | **Astro** 6.4.x | File-based routing, first-class Markdown + content collections, minimal client JS. Node 22.22+. |
| CMS | **Decap CMS** 3.14 | Git-based, no runtime DB, config-only setup, editable via `/admin/`. |
| CMS auth broker | 3-file **serverless OAuth broker** in `api/` (auth.js, callback.js, admin-config.js) | ~90 lines of Node built-ins, no npm OAuth lib. Talks to GitHub's OAuth so editors log in with their GitHub account. |
| Host | **Vercel** | Runs the serverless auth broker + the static Astro build. Auto-deploys on push to `main`. |
| Fonts | Self-hosted via `@fontsource` (Cormorant Garamond display, Source Serif 4 body, Inter UI, Instrument Serif for the occasional accent) | No Google Fonts round-trip; deterministic offline behavior. |
| Type-check / build validation | `npx astro check` | 0 errors gate before every commit. |

**Environment variables (Vercel only, never in repo):**
`OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`. Local `.env.example`
documents them; no `.env` is committed.

---

## 3. Information architecture

Five-item primary nav, each a real section:

- `/` — Home (hero, welcome intro, featured 3-card promo, 5-section explore
  grid with fleur-de-lis anchor, Bette Midler pull quote on purple, donate CTA)
- `/sisters/` — The Sisters (bios + timelines) *[built]*
- `/music/` — Music (Boz Beat lessons, discography, reviews) *[built]*
- `/press/` — Press (vintage articles, press room, interviews, video) *[not yet built]*
- `/legacy/` — Legacy (tribute performers, Bozcasts, ASCAP, Boz of the Month) *[not yet built]*
- `/about/` — About / donate / contact *[not yet built]*

**URL scheme:** grouped by section. Examples:
`/sisters/connee/`, `/sisters/bio-resources/`,
`/press/vintage/[slug]/`, `/music/lessons/[n]/`,
`/legacy/bozcasts/[slug]/`. The URL segment after a section name
matches the sub-hub name from the 2022 Wayback IA.

**Nav wordmark:** "The Boswell Sisters · 1925 to 1936".

---

## 4. Content model

Astro content collections declared in `src/content.config.ts`, each with a
matching schema in `api/admin-config.js` for the Decap CMS UI. Everything
below is CMS-editable — templates never hard-code copy.

| Collection | Folder | Notes |
|---|---|---|
| `pages` | `src/content/pages/` | One-off pages (home, about, donate, contact, section landings). Fields: title, hero (image/alt/credit), intro (eyebrow/lede/body), sections index copy, donate teaser copy, tagline, quote/attribution, promoCards[] |
| `sisters` | `src/content/sisters/` | 3 sister bios. Fields: name, nickname, portrait/alt, pullQuote/attribution, order, **facts object** (born, died, hairColor, eyeColor, complexion, height, marriage, children) |
| `timelines` | `src/content/timelines/` | Trio + Connee-solo. Fields: title, subject, pullQuote/attribution, **entries[]** (year, event, image, imageAlt) — renders via `<Timeline>` component |
| `lessons` | `src/content/lessons/` | 5 Boz Beat lesson entries. Fields: title, order, audioFile, duration, summary, hero. |
| `articles` | `src/content/articles/` | 26 press articles. Fields: title, **subhub** enum (vintage / in-their-own-words / video / essay / feature), publication, publicationDate, author, hero, videoEmbed, externalLink |
| `pressReleases` | `src/content/press-releases/` | 9 press-release entries. Fields: title, releaseDate, **document** (PDF/GIF/image path), documentType, summary |
| `performers` | `src/content/performers/` | Tribute performer directory. Fields: name, region, photo, activeSince, links[] |
| `legacyFeatures` | `src/content/legacy-features/` | Community features. Fields: title, subhub enum (bozcasts / ascap / boz-of-the-month / feature), date, hero, externalLink |
| `chartEntries` | `src/content/chart-entries/` | Boz on the Charts data. Fields: songTitle, artist enum, year, peakPosition, chart, notes |
| `siteSettings` | `src/content/site/` | Global settings. Fields: siteName, tagline, contactEmail, donateUrl, footerCredits |

Every image field in the CMS enforces alt text at the schema level.

---

## 5. Content sourcing

Original site content preserved from the [Wayback Machine](https://web.archive.org/):

- **2019-01-09 capture** — first scrape, 35 pages, 50 images, 6 audio files.
  Scraper: `../boswell/legacy-content/scrape.py`.
- **2022-07-04 capture** — delta scrape, picked up 6 BozBuz sub-hubs +
  12 vintage articles + 9 press-release PDFs the 2019 capture didn't have.
  Scrapers: `../boswell/legacy-content/scrape-2022-delta*.py`.
- **Cleaning + extraction scripts** — `../boswell/legacy-content/clean-sisters-timelines.py`
  strips WP chrome; `../boswell/legacy-content/extract-facts-and-timeline.py`
  pulls structured `facts` and `entries[]` out of the malformed WP tables into
  frontmatter.
- **Import script** — `../boswell/legacy-content/import-to-astro.py` maps
  each scraped page to its Astro collection + slug, copies assets into
  `public/uploads/`, rewrites paths.

**Missing content:** 43 images referenced by the original site were never
crawled by Wayback (empty availability API response). Full list in
`../boswell/legacy-content/missing-assets.md`.

**Additional imagery (public domain):**
- Wikimedia Commons:
  `Connee Boswell 1941.JPG` → `public/uploads/connee-portrait.jpg`,
  `Martha Boswell, 1931 (cropped).jpg` → `public/uploads/martha-portrait.jpg`.
- All other portraits/photos in `public/uploads/` are from the original
  bozzies.org via Wayback.

---

## 6. Design system

Tokens: `src/styles/tokens.css`. Global reset + fonts + ground utilities:
`src/styles/global.css`.

**Palette (WCAG AA on ivory verified):**
- Grounds: `--ink #181615`, `--paper #F4F0E8`, `--purple #4A2E5A`,
  `--yellow-bright #C99A2A` (as `.ground-gold`)
- Text-safe metallics: `--brass #7A5F32`, `--yellow #8F6C1D`,
  `--copper #7C4E30` (each has a `-bright` variant for use on dark grounds)
- Reserves: `--oxblood`, `--emerald`, `--navy`
- Muted overlay text: `rgba(30,27,24,0.78)` on paper; `rgba(237,230,214,0.62)` on ink

**Type:**
- Display: `Cormorant Garamond` (headings, hero, section titles)
- Body: `Source Serif 4` (paragraphs)
- UI / small caps / italic: `Inter` (nav, labels, kickers, all italics)
- Accent: `Instrument Serif` (reserved; currently unused)
- Base font-size: 112.5% (18px). Type scale: 1.25 ratio.

**Grounds:** `.ground-paper` / `.ground-ink` / `.ground-purple` / `.ground-gold`
utility classes in global.css. Each sets background + text color + link color
+ eyebrow color. Sections alternate for editorial rhythm.

**Components (`src/components/`):**
| Component | Purpose |
|---|---|
| `Nav.astro` | Sticky 5-item nav with active-page underline |
| `Footer.astro` | Purple footer with wordmark, tagline, section links, non-profit credit |
| `Hero.astro` | Two layouts: `full-bleed` (section landings) and `split` (home page — image left with horizontal purple gradient wash 20→100%, text right on solid purple). Deco corner brackets. |
| `PullQuote.astro` | Big italic-sans quote block. Color adapts per ground. |
| `SectionDivider.astro` | Only the `jazz` variant is used site-wide — a 5-line staff with treble clef, time signature, beamed notes, closing double bar. Other variants (`fan`, `step`, `fleur`, `deco`, `notes`, `bar-line`, `second-line`, `rays`, `diamond`) available but currently unused. |
| `MusicBackdrop.astro` | Low-opacity SVG backdrop patterns. Variants: Art Deco (`sunburst`, `chevrons`, `arcs`, `rays`, `diamond-grid`); New Orleans / jazz (`staves`, `notes`, `fleur`, `ironwork`, `piano-keys`, `vinyl`, `sheet-music`, `saxophone`, `jazz-club`). |
| `Timeline.astro` | Vertical timeline: brass hairline, dot markers, small-caps year column, event prose column. Reads `entries[]` frontmatter; CMS-editable. |

**Ornament vocabulary:** Art Deco geometry for backgrounds; New Orleans /
jazz motifs (musical staves, treble clef, fleur-de-lis, saxophone) for
section separators and prominent flourishes.

---

## 7. Directory tour

```
boswell-poc/
├── PROJECT.md               ← this file
├── README.md                ← quick-start for local dev
├── astro.config.mjs         ← minimal — everything runs off defaults
├── package.json             ← Node 22+, Astro 6.4, @fontsource fonts, sharp
├── vercel.json              ← one rewrite: /admin/config.yml → /api/admin-config
├── api/                     ← Vercel serverless functions
│   ├── auth.js              ← starts GitHub OAuth
│   ├── callback.js          ← finishes OAuth handshake, returns token to Decap
│   └── admin-config.js      ← serves the full Decap CMS schema as YAML
├── public/
│   ├── admin/index.html     ← Decap loader (single <script> tag from unpkg)
│   └── uploads/             ← all site images, audio (MP3 lessons), docs (PDFs)
└── src/
    ├── layouts/Base.astro   ← <html>/<head>/<body>, wires Nav + Footer + global styles
    ├── styles/
    │   ├── tokens.css       ← design tokens (colors, type scale, spacing, motion)
    │   └── global.css       ← reset, font faces, ground utilities, section rhythm
    ├── components/          ← Nav, Footer, Hero, PullQuote, SectionDivider, MusicBackdrop, Timeline
    ├── content.config.ts    ← 10 Astro content collections with zod schemas
    ├── content/             ← Markdown files, one per entry per collection
    └── pages/
        ├── index.astro      ← home
        └── sisters/
            ├── index.astro          ← /sisters/ landing
            ├── [slug].astro         ← /sisters/{connee,martha,vet}/
            └── bio-resources.astro  ← /sisters/bio-resources/ (Kyla Titus book)
```

Legacy-content workspace (outside this repo, at `../boswell/legacy-content/`)
holds the scraped source material and one-off scripts. Not needed at runtime.

---

## 8. Working conventions

- **CMS-first.** Templates read from frontmatter fields. Copy never lives in
  `.astro` files. If a new copy field is needed, add it to `content.config.ts`
  + `api/admin-config.js`, then reference in the template.
- **No em dashes** in copy written for the site (unless it's the site owner's
  original writing preserved verbatim, or a typographic convention like the
  attribution line "— Bette Midler").
- **Alt text required.** Every image field in the CMS schema is either a
  paired `image + imageAlt` set or marks alt as required.
- **Reuse components.** Hero, PullQuote, SectionDivider (`jazz` only), MusicBackdrop,
  Timeline. Don't build one-off variants unless the pattern genuinely repeats.
- **`astro check` gates commits.** 0 errors before each commit.
- **Screenshot each new template variant** on desktop before committing.
  Use headless Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --window-size=1440,3200 --screenshot=/tmp/x.png http://localhost:4321/…`.
- **Grouped URL structure** (`/press/vintage/[slug]/`) mirrors the 2022 IA
  sub-hub hierarchy. Decided up-front so links don't need rewriting.
- **Duty split.** Code, scaffolding, and local checks happen here.
  Anything requiring a browser session, OAuth grant, or third-party
  dashboard (Vercel env vars, GitHub OAuth app, DNS) is Keith's.

---

## 9. Dev workflow

```bash
cd /Users/keithhalpin/boswell-poc
npm install        # first time
npm run dev        # serves at http://localhost:4321
npx astro check    # type/schema check, 0 errors gate
npm run build      # production build to dist/ (Vercel runs this on push)
```

The Decap CMS `/admin/` UI works locally but needs live OAuth env vars
(set in Vercel) to actually authenticate. The GitHub-backed edit loop only
runs against the deployed environment.

**Commit cadence:** each section (Sisters, Music, Press, Legacy, About)
gets its own commit — one section-shaped chunk of work, screenshot-verified,
astro-check clean. Small iterations (typography, spacing, copy fixes) can
fold into the next planned commit or ship as their own tight commit.

---

## 10. What's built so far

**Home page** — hero (split, purple gradient), welcome intro, 3-card
Featured section on bourbon-gold ground, 5-section Explore grid with a bold
fleur-de-lis 6th cell, Bette Midler pull quote on solid purple, donate CTA.
All copy CMS-editable via `src/content/pages/home.md`.

**Sisters section** —
- `/sisters/` landing: hero, welcome intro, 3-card sister grid, trio pull
  quote, Bio Biography teaser
- `/sisters/{connee,martha,vet}/`: compact purple hero, facts strip (born,
  died, hair, eyes, complexion, height, marriage, children), two-column
  bio body with **sticky 300×300 portrait on the left + prose on the right**
  (Connee 1941 and Martha 1931 from Wikimedia Commons public domain;
  Vet 1932 cropped from the signed Boswell Sisters 1932 group photo)
- `/sisters/connee/` additionally embeds her solo-career timeline via
  the `<Timeline>` component (20 date/event entries)
- `/sisters/bio-resources/`: Kyla Titus *The Boswell Legacy* book page

**Music section** —
- `/music/` landing: full-bleed hero (Boswells + Bing Crosby), imported
  intro copy on ivory, five lesson cards in a vertical stack, purple
  section with two teaser cards to Charts and Reviews
- `/music/lessons/{1..5}/`: compact purple hero, custom audio-player
  module (native `<audio controls>` + download link), lesson notes as
  prose, Prev/All/Next cycling through the 5 lessons
- `/music/charts/`: two chart-position tables (Boswell Sisters 1931–1938
  and Connee 1932–1954) rendered as editorial ledgers — purple caps
  header, alternating row tints, brass display serif for peak positions
- `/music/reviews/`: album review cards, each with a purple accent bar,
  display serif title, italic-sans description

**Design system, components, and CMS schema** all in place and validated.

---

## 11. Not yet built

Section landings and entry templates for **Press**, **Legacy**, **About**.
Content is imported and waiting in `src/content/*` — routes need to be added.

**Also outstanding:**
- The 12th vintage article (`/boz-buz-vintage-article/`, no suffix) failed
  the delta scrape; 11 of 12 vintage articles imported.
- 43 lost images across 8 pages (`../boswell/legacy-content/README.md`
  §"Known content loss") — need owner decision per page: rebuild without,
  source replacements, or drop.
- Redirect map from old WordPress URLs (`/bozbios/` → `/sisters/`, etc.).
- `sitemap.xml`, `robots.txt`, `404.astro`, Open Graph metadata, JSON-LD
  schema markup (Person, MusicGroup, Article, AudioObject).
- Amazon affiliate status decision (BozBuys section — include or drop).
- Domain choice (bozzies.com vs .org vs both) and DNS cutover.

---

## 12. Open decisions (small)

- Sub-nav rendering per section — 2022 IA has sub-hubs (e.g., BozBuz →
  Press Room / Vintage Articles / In Their Own Words / Video / Essay); no
  visible sub-nav pattern implemented yet.
- Whether to expose `/admin/` in the visible nav or keep it as a bookmarked
  editor-only URL (currently the latter — Nav has no `/admin/` link).

---

## 13. How to update this doc

- On any commit that changes the tech stack, adds a section or major
  component, imports new content, or shifts a working convention:
  edit this file to reflect it, and update the "Last updated" line at the
  top. The commit should touch both the change and this file together.
- Small tweaks (typography, spacing, single-color changes) don't need a
  doc update.
- Keep it terse. If a section grows past ~30 lines, split into two.
- Never add credentials, tokens, private URLs, or personally identifying
  information. This file is in the public repo.

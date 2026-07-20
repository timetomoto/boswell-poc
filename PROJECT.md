# The Boswell Sisters — Site Rebuild

Living reference for this project. Update alongside each meaningful commit so a
returning developer (or Claude session) can pick up cold without re-reading the
entire chat history. Nothing sensitive belongs in this file — no tokens, no
secrets, no private URLs. Kept in the repo, not served by the site.

**Last updated:** 2026-07-20, Career Timeline + Discography pages.

---

## 1. What this is

A modern rebuild of **bozzies.org** — the non-profit tribute site for The
Boswell Sisters (Martha, Connee, and Vet), the New Orleans vocal harmony trio
active 1925–1936. The legacy site ran on WordPress 4.5.16 and had been frozen
at 2016 content until it was replaced by this rebuild.

**Goal:** preserve the site's editorial content, modernize the design to a
museum-editorial standard, and give the owner a CMS that lets non-technical
editors maintain everything (page copy, hero images, playlists, quotes, nav,
footer) without a developer in the loop.

**Repo:** [github.com/timetomoto/boswell-poc](https://github.com/timetomoto/boswell-poc)

**Local working directory:** `/Users/keithhalpin/boswell-poc`

---

## 2. Tech stack

| Piece | Choice | Why |
|---|---|---|
| Static site generator | **Astro** 6.4.x | File-based routing, first-class Markdown + content collections, minimal client JS. Node 22.22+. |
| CMS | **Decap CMS** 3.14 (via CDN) | Git-based, no runtime DB, config-only setup, editable via `/admin/`. |
| CMS auth broker | 3-file **serverless OAuth broker** in `api/` (auth.js, callback.js, admin-config.js) | ~90 lines of Node built-ins, no npm OAuth lib. Talks to GitHub's OAuth so editors log in with their GitHub account. |
| Host | **Vercel** | Runs the serverless auth broker + the static Astro build. Auto-deploys on push to `main`. |
| Fonts | Self-hosted via `@fontsource` (Cormorant Garamond display, Source Serif 4 body, Inter UI) | No Google Fonts round-trip; deterministic offline behavior. |
| Type-check / build validation | `npx astro check` | 0 errors gate before every commit. |

**Environment variables** (Vercel only, never in repo):
`OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`, `OAUTH_STATE_SECRET`.

---

## 3. Information architecture

Four-item primary nav, each a real section, plus a Donate button:

- `/` — Home (hero, welcome intro, playlist section, voices carousel, sample-the-sound CTA on ink ground, donate teaser)
- `/sisters/` — The Sisters (bios + Bio Biography subpage + Career Timeline subpage)
- `/press/` — Press (vintage articles, in-their-own-words, video features, features, essays, press releases)
- `/media/` — Media (playlist, audio lessons, charts, reviews, discography)
- `/about/` — About (mission, contact + donate CTA)

**Donate button** — sits after the four nav items; URL and label pulled from `siteSettings`.

**URL scheme:** grouped by section. Examples: `/sisters/connee/`,
`/sisters/bio-resources/`, `/press/vintage/[slug]/`, `/media/lessons/[n]/`,
`/media/charts/`, `/media/reviews/`.

**Nav wordmark:** "The Boswell Sisters · 1925 to 1936" (kept hardcoded as branding).

---

## 4. Content model

Astro content collections declared in `src/content.config.ts`, each with a
matching schema in `api/admin-config.js` for the Decap CMS UI. Everything
below is CMS-editable — templates never hard-code copy.

| Collection | Folder | Notes |
|---|---|---|
| `pages` | `src/content/pages/` | One-off pages (home, about, donate, contact, section landings). Fields include hero (image/alt/credit), intro (eyebrow/lede/body[]), and per-section eyebrows/titles/blurbs/CTAs for every hardcoded section role on each landing. |
| `sisters` | `src/content/sisters/` | 3 sister bios. Fields: name, nickname, portrait/alt, pullQuote/attribution, order, **facts object** (born, died, hairColor, eyeColor, complexion, height, marriage, children). |
| `timelines` | `src/content/timelines/` | Trio + Connee-solo. Fields: title, subject, pullQuote/attribution, **entries[]** (year, event, image, imageAlt) — renders via `<Timeline>` component. |
| `lessons` | `src/content/lessons/` | 5 audio lesson entries. Fields: title, order, audioFile, duration, summary, hero. |
| `playlists` | `src/content/playlists/` | Curated music playlists (currently one: Volume One with 26 archive.org tracks). Fields: title, subtitle, order, **tracks[]** (title, artist, year, duration, audio URL). |
| `articles` | `src/content/articles/` | Press articles. Fields: title, **subhub** enum (vintage / in-their-own-words / video / essay / feature), publication, publicationDate, author, hero, videoEmbed (renders as iframe on video-subhub articles), externalLink. |
| `pressReleases` | `src/content/press-releases/` | Press-release entries. Fields: title, releaseDate, **document** (PDF/GIF/image path), documentType, summary. |
| `performers` | `src/content/performers/` | Tribute performer directory (schema retained; no route currently rendered). |
| `legacyFeatures` | `src/content/legacy-features/` | Community features (schema retained; no route currently rendered). |
| `chartEntries` | `src/content/chart-entries/` | Boz on the Charts data (empty — charts render from a static table on `charts.md` today). |
| `siteSettings` | `src/content/site/` | Global settings. Fields: siteName, tagline, contactEmail, donateUrl, donateLabel, footerCredits. |
| `navigation` | `src/content/navigation/` | Nav item list used by both header and footer. Fields: items[] (label, href, external). |
| `voices` | `src/content/voices/` | Home-page quotes carousel (one file with a quotes[] list). |
| `pressHubs` | `src/content/press-hubs/` | Press sub-hub descriptors (5 files: vintage, in-their-own-words, video, feature, essay). Fields: slug, kicker, label, blurb, order. |
| `discographySessions` | `src/content/discography/` | Session-by-session discography, 2 files (trio-era, connee-solo). Fields: title, subtitle, attribution, sessions[] (each with header + tracks[{matrix, title, notes, refs}]). 128 sessions, 500+ tracks. Sourced from Paul Gaffey's guymcafee.com via web.archive.org. |

Every image field in the CMS enforces alt text at the schema level.

---

## 5. Content sourcing

Original site content preserved from the [Wayback Machine](https://web.archive.org/):

- **2019 / 2022 WordPress captures** — first + delta scrapes, 35+ pages, images, audio, PDFs.
- **2023 Elementor redesign capture** — used as the design vision for the rebuild's home + hero copy.
- **Legacy-content workspace** — outside this repo, at `../boswell/legacy-content/` — holds scrapers and cleaning scripts. Not needed at runtime.
- **Additional imagery (public domain)** — Wikimedia Commons portraits: `Connee Boswell 1941.JPG`, `Martha Boswell, 1931 (cropped).jpg`.
- **Music playlist** — 26 Boswell Sisters recordings streamed from `archive.org`'s 78rpm public-domain collection; each track's MP3 URL and duration is baked into `playlists/volume-one.md`.
- **Video features** — YouTube embed URLs baked into `articles/video-*.md` (from the old buz-video.php pages).

Any surviving `originalUrl` field in a content entry is a **provenance breadcrumb** — hidden from users, kept for archival tracing back to the source WordPress URL.

---

## 6. Design system

Tokens: `src/styles/tokens.css`. Global reset + fonts + ground utilities:
`src/styles/global.css`.

**Palette (WCAG AA on ivory verified):**
- Grounds: `--ink #181615`, `--paper #F4F0E8`, `--purple #4A2E5A`, `--yellow-bright #C99A2A` (as `.ground-gold`)
- Text-safe metallics: `--brass #7A5F32`, `--yellow #8F6C1D`, `--copper #7C4E30` (each has a `-bright` variant for dark grounds)
- Muted overlay text: `rgba(30,27,24,0.78)` on paper; `rgba(237,230,214,0.62)` on ink
- Link color: `--link #0044AA` on ivory (AA), `--link-on-dark #9EC5FF` on ink/purple

**Type:**
- Display: `Cormorant Garamond` (headings, hero, section titles)
- Body: `Source Serif 4` (paragraphs)
- UI / small caps / italic: `Inter` (nav, labels, kickers, all italics)
- Base font-size: 112.5% (18px). Type scale: 1.25 ratio.

**Grounds:** `.ground-paper` / `.ground-ink` / `.ground-purple` / `.ground-gold` utility classes in global.css. Each sets background + text color + link color + eyebrow color.

**Components (`src/components/`):**
| Component | Purpose |
|---|---|
| `Nav.astro` | Sticky nav with wordmark, CMS-driven item list, Donate button |
| `Footer.astro` | Purple footer with wordmark, tagline, CMS-driven nav link list, footer credits |
| `Hero.astro` | Two layouts: `full-bleed` (section landings) and `split` (home page). Deco corner brackets. |
| `PullQuote.astro` | Big italic-sans quote block. Color adapts per ground. |
| `SectionDivider.astro` | Only the `jazz` variant is used site-wide (5-line staff + treble clef + notes + closing double bar). |
| `MusicBackdrop.astro` | Low-opacity SVG backdrop patterns. Variants: `sunburst`, `chevrons`, `arcs`, `rays`, `diamond-grid`, `staves`, `notes`, `fleur`, `ironwork`, `piano-keys`, `vinyl`, `sheet-music`. First-section-below-hero on every page renders WITHOUT a backdrop by design. |
| `Timeline.astro` | Vertical timeline: brass hairline, dot markers, small-caps year column, event prose column. Reads `entries[]` frontmatter; CMS-editable. |
| `PlaylistPlayer.astro` | HTML5 audio player with click-to-play track list; scrolls internally to ~3 rows; duration column per track; playlist prop supplied from CMS entry. |
| `QuotesCarousel.astro` | Auto-rotating fade carousel with prev/next arrows, dot indicators, pause on hover/focus, keyboard nav, aria-live announcements, respects prefers-reduced-motion. |

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
│   ├── admin/index.html     ← Decap loader — includes <link rel="cms-config-url"> pointing at /api/admin-config
│   └── uploads/             ← all site images, audio (MP3 lessons), docs (PDFs)
└── src/
    ├── layouts/Base.astro   ← <html>/<head>/<body>, wires Nav + Footer + global styles
    ├── styles/
    │   ├── tokens.css       ← design tokens (colors, type scale, spacing, motion)
    │   └── global.css       ← reset, font faces, ground utilities, section rhythm
    ├── components/          ← Nav, Footer, Hero, PullQuote, SectionDivider, MusicBackdrop, Timeline, PlaylistPlayer, QuotesCarousel
    ├── content.config.ts    ← 13 Astro content collections with zod schemas
    ├── content/             ← Markdown files, one per entry per collection
    └── pages/
        ├── index.astro
        ├── about.astro
        ├── sisters/
        │   ├── index.astro          ← /sisters/
        │   ├── [slug].astro         ← /sisters/{connee,martha,vet}/
        │   ├── bio-resources.astro  ← /sisters/bio-resources/
        │   └── career-timeline.astro← /sisters/career-timeline/ (trio timeline via <Timeline>)
        ├── press/
        │   ├── index.astro          ← /press/
        │   └── [subhub]/[slug].astro
        └── media/
            ├── index.astro          ← /media/
            ├── charts.astro
            ├── reviews.astro
            ├── discography.astro    ← /media/discography/ (client-side search across 128 sessions)
            └── lessons/[order].astro
```

---

## 8. Working conventions

- **CMS-first.** Templates read from frontmatter fields. Copy never lives in `.astro` files. If a new copy field is needed, add it to `content.config.ts` + `api/admin-config.js`, then reference in the template.
- **Never hide UI when data is empty.** Render the shell (button, section, link) always; only the value flows in as blank. Blank donate URL → button still renders with empty href. Removing the visible element requires an explicit user ask.
- **Alt text required.** Every image field in the CMS schema is either a paired `image + imageAlt` set or marks alt as required.
- **Reuse components.** Hero, PullQuote, SectionDivider (`jazz` only), MusicBackdrop, Timeline, PlaylistPlayer, QuotesCarousel. Don't build one-off variants unless the pattern genuinely repeats.
- **`astro check` gates commits.** 0 errors before each commit.
- **Grouped URL structure** (`/press/vintage/[slug]/`) mirrors the 2022 IA sub-hub hierarchy. Decided up-front so links don't need rewriting.
- **Duty split.** Code, scaffolding, and local checks happen here. Anything requiring a browser session, OAuth grant, or third-party dashboard (Vercel env vars, GitHub OAuth app, DNS) is the owner's.
- **No em dashes** in copy written for the site (unless preserving the site owner's original writing verbatim, or a typographic convention like "— Bette Midler").

---

## 9. Dev workflow

```bash
cd /Users/keithhalpin/boswell-poc
npm install        # first time
npm run dev        # serves at http://localhost:4321
npx astro check    # type/schema check, 0 errors gate
npm run build      # production build to dist/ (Vercel runs this on push)
```

The Decap CMS `/admin/` UI works locally but needs live OAuth env vars (set in Vercel) to actually authenticate. The GitHub-backed edit loop only runs against the deployed environment.

**Commit cadence:** each section or major refactor gets its own commit, screenshot-verified when relevant, astro-check clean.

---

## 10. What's built

- **Home page** — split hero, welcome intro (lede + multi-paragraph body), 26-track playlist section, purple voices carousel, ink-ground Sample-the-Sound CTA, donate teaser.
- **About page** — full-bleed hero, prose mission body, purple CTA section with Contact + Donate buttons (both editable via CMS).
- **Sisters section** — landing with 3-card sister grid + Boz Biography teaser; individual bio pages with facts strip + sticky portrait + prose + trio timeline embed on Connee's page; bio-resources page (Kyla Titus book).
- **Press section** — landing with 5 sub-hub sections (each driven by the `pressHubs` collection) + press releases grid; per-article routes with video embeds for the video sub-hub.
- **Media section** — landing with playlist above lessons + charts/reviews teasers; per-lesson pages with audio player; charts page with static table; reviews page with review cards.
- **CMS editability** — full pass complete. Nav items, footer, page copy, section eyebrows/titles/blurbs, quotes carousel, playlist tracks, press-hub labels — all editable in Decap. Layout and structural CSS remain locked.
- **Broken-link cleanup** — legacy WordPress footer nav links inside 11 vintage articles redirected to internal `/press/vintage/`; `feature-second-line-recap.md` scrubbed of its dumped nav table; `donate.md` cleaned; Boz Buds and old buz-video.php links replaced with internal equivalents.
- **Video content backfill** — 8 new video article entries generated from the old buz-video.php pages 2–4 (Under Montana Skies, Sleepy Time Down South, Lou'siana Waddle, Falling Star, Connee/Brian Sisters, Crazy People, Martha M'appari, Alexander's Ragtime Band), each with a YouTube embed.

---

## 11. Still open

- **Broken-link Category B/C/D** — some article back-links still point at defunct old-site URLs (Continue-to-Part-2 links, Randall Riley bio, tribute performer sub-pages, Boz Buys product link, Centennial page, King Sisters PDF). Handle case-by-case once redirect targets are chosen.
- **Page 1 buz-video content** — Heebie Jeebies, Close Farmony, Rock and Roll — YT IDs were ambiguous in the scrape; article files not yet created.
- **Ambassador of Harmony GIFs** — 2 heritage GIFs failed Wayback fetch; retrieve manually if we want to use them.
- **chart-entries collection** — schema exists but empty; charts render from a static table today. Populate as individual entries only if we want dynamic filtering.
- **Timeline widget** — timeline data exists for trio + Connee, but no visual timeline component is wired on the sister bio pages yet (Connee's uses `<Timeline>`; Martha and Vet don't).
- **Redirect map** — from old WordPress URLs (`/bozbios/` → `/sisters/`, etc.).
- **SEO / discovery** — `sitemap.xml`, `robots.txt`, `404.astro`, Open Graph metadata, JSON-LD schema markup (Person, MusicGroup, Article, AudioObject).
- **Real Donate URL** — `siteSettings.donateUrl` is currently blank; the button renders but is a no-op until set in the CMS.
- **Domain choice** (bozzies.com vs .org vs both) and DNS cutover.

---

## 12. How to update this doc

- On any commit that changes the tech stack, adds a section or major component, imports new content, or shifts a working convention: edit this file to reflect it, and update the "Last updated" line at the top. The commit should touch both the change and this file together.
- Small tweaks (typography, spacing, single-color changes) don't need a doc update.
- Keep it terse. If a section grows past ~40 lines, split into two.
- Never add credentials, tokens, private URLs, or personally identifying information. This file is in the public repo.

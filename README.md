# boswell

Foundation repo for the Boswell site. Stack: **Astro (static) + Decap CMS + GitHub OAuth login + Vercel + GitHub repo**.

The public site is pure static HTML. Content lives in `src/content/` as Markdown; an editor logs into `/admin/` via GitHub OAuth, saves changes as commits to this repo, Vercel auto-rebuilds.

## Stack (verified 2026-07-08)

- `astro` `^6.4.4`
- `decap-cms` (via CDN) `^3.14.0` — latest 3.14.1 released 2026-06-15
- Vercel serverless functions (Node runtime) using only Node built-ins — no OAuth library dependency
- Node `>=22.22.0`

## Layout

- `src/` — Astro site: pages, layouts, and content collections.
- `public/admin/index.html` — Decap CDN loader.
- `api/` — three Vercel serverless functions:
  - `auth.js` — starts the GitHub OAuth flow (issues an HMAC-signed CSRF state cookie).
  - `callback.js` — verifies state, exchanges the code for a token, posts it back to the Decap admin.
  - `admin-config.js` — serves `/admin/config.yml` dynamically with `base_url` auto-matched to the request host.
- `vercel.json` — one rewrite: `/admin/config.yml` → `/api/admin-config`.

## Env vars

Set in Vercel Project Settings → Environment Variables. Never in this repo. See `.env.example` for the full list and purpose of each.

## Detailed reference

See `MASTER_DOC.md` (local only, git-ignored) for full architecture, editor-login flow explanation, and build roadmap.

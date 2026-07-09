# boswell-poc

**Throwaway POC #2.** Proves whether the owner edit → save → commit → redeploy loop works on **Astro + Decap CMS + GitHub OAuth + Vercel + GitHub repo**. Replaces the earlier Tina POC (blocked by an unresolved TinaCloud cloud-check bug — see `discovery/07-poc-tina-astro-verdict.md`). Not the real build.

## Stack (verified 2026-07-08)

- `astro` `^6.4.4`
- `decap-cms` (via CDN) `^3.14.0` — latest 3.14.1 released 2026-06-15
- Vercel serverless functions (Node runtime) using only Node built-ins — no OAuth library dependency
- Node `>=22.22.0`

## What's here

- Astro static site with 3 pages (Home, About, one article) and a placeholder SVG.
- Decap admin at `/admin/` (CDN loader).
- `/admin/config.yml` served **dynamically** by `/api/admin-config` so `base_url` auto-matches whatever URL Vercel assigns — no manual edit after deploy.
- Two OAuth functions:
  - `/api/auth` — redirects to GitHub's authorize URL.
  - `/api/callback` — exchanges the code for an access token and posts it back to the Decap admin popup.
- OAuth Client Secret lives in Vercel env vars only. Nothing sensitive in this repo.

## Owner-side steps

See `discovery/09-poc-decap-verdict.md` for the click-by-click handoff. Do not follow steps from this README alone; the handoff doc is the source of truth.

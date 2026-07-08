# boswell-poc

**Throwaway.** Proves whether the owner edit → save → commit → redeploy loop works on Astro + TinaCMS (TinaCloud) + Vercel + GitHub. Not the real build. Delete when done.

## Stack (verified 2026-07-08)

- Astro `^6.4.4` (starter-pinned; latest 7.0.7 held back for @tinacms/astro compat)
- `@tinacms/astro` `^0.5.1`
- `tinacms` `^3.10.0`, `@tinacms/cli` `^2.5.3`
- `@astrojs/vercel` `^10.0.8`
- Node `>=22.22.0`

## Content

Two page entries (`home`, `about`) + one article (`hello-boz`), each with `title`, `heroImage`, and Markdown body. Placeholder SVG at `/public/hero.svg`.

## Owner-side steps

See the accompanying handoff document (`discovery/07-poc-tina-astro-handoff.md`) for the exact click-by-click steps to connect TinaCloud, set env vars, and deploy on Vercel. Do NOT try to run those steps from this README — the handoff doc has the specifics.

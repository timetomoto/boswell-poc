// @ts-check
import { defineConfig } from 'astro/config';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321',
  output: 'static',
  adapter: vercel(),
  integrations: [tina()],
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'assets.tina.io' }],
  },
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: { noExternal: ['@tinacms/astro', '@tinacms/bridge'] },
  },
});

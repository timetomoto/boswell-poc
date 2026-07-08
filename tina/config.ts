import { defineConfig } from 'tinacms';
import { PageCollection } from './collections/page';
import { ArticleCollection } from './collections/article';

const branch =
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.GITHUB_BRANCH ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID as string,
  token: process.env.TINA_TOKEN as string,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [PageCollection, ArticleCollection],
  },
});

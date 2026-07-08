import type { Collection } from 'tinacms';

export const ArticleCollection: Collection = {
  name: 'article',
  label: 'Articles',
  path: 'src/content/article',
  format: 'md',
  ui: {
    router: ({ document }) => `/articles/${document._sys.filename}`,
  },
  fields: [
    { name: 'title', label: 'Title', type: 'string', required: true, isTitle: true },
    { name: 'heroImage', label: 'Hero image', type: 'image' },
    { name: 'body', label: 'Body', type: 'rich-text', isBody: true },
  ],
};

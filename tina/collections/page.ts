import type { Collection } from 'tinacms';

export const PageCollection: Collection = {
  name: 'page',
  label: 'Pages',
  path: 'src/content/page',
  format: 'md',
  ui: {
    router: ({ document }) => (document._sys.filename === 'home' ? '/' : `/${document._sys.filename}`),
  },
  fields: [
    { name: 'title', label: 'Title', type: 'string', required: true, isTitle: true },
    { name: 'heroImage', label: 'Hero image', type: 'image' },
    { name: 'body', label: 'Body', type: 'rich-text', isBody: true },
  ],
};

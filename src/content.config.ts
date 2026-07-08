import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const page = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/page' }),
  schema: z.object({
    title: z.string(),
    heroImage: z.string().optional(),
  }),
});

const article = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/article' }),
  schema: z.object({
    title: z.string(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { page, article };

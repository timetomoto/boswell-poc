import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One-off site pages (home, about, contact, donate, section landings)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    subtitle: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroCredit: z.string().optional(),
    quote: z.string().optional(),
    quoteAttribution: z.string().optional(),
    // Home-page structural copy (all editable in CMS)
    introEyebrow: z.string().optional(),
    introLede: z.string().optional(),
    introBody: z.string().optional(),
    sectionsEyebrow: z.string().optional(),
    sectionsTitle: z.string().optional(),
    donateEyebrow: z.string().optional(),
    donateTitle: z.string().optional(),
    donateBody: z.string().optional(),
    // Hero tagline (short playful line below the title)
    tagline: z.string().optional(),
    // Featured promo section — up to 3 cards
    promoEyebrow: z.string().optional(),
    promoTitle: z.string().optional(),
    promoCards: z.array(z.object({
      kicker: z.string().optional(),
      title: z.string(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      link: z.string(),
      external: z.boolean().optional(),
      linkLabel: z.string().optional(),
    })).optional(),
    order: z.number().optional(),
    originalUrl: z.string().optional(),
  }),
});

// The three sister biographies
const sisters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sisters' }),
  schema: z.object({
    name: z.string(),
    nickname: z.string().optional(),
    portrait: z.string().optional(),
    portraitAlt: z.string().optional(),
    pullQuote: z.string().optional(),
    pullQuoteAttribution: z.string().optional(),
    order: z.number(),
    /* Structured biographical facts — replaces the malformed WP table */
    facts: z.object({
      born: z.string().optional(),
      died: z.string().optional(),
      hairColor: z.string().optional(),
      eyeColor: z.string().optional(),
      complexion: z.string().optional(),
      height: z.string().optional(),
      marriage: z.string().optional(),
      children: z.string().optional(),
    }).optional(),
    originalUrl: z.string().optional(),
  }),
});

// Timelines — trio + Connee-solo (and any future ones)
const timelines = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timelines' }),
  schema: z.object({
    title: z.string(),
    subject: z.enum(['trio', 'connee', 'martha', 'vet']),
    intro: z.string().optional(),
    pullQuote: z.string().optional(),
    pullQuoteAttribution: z.string().optional(),
    entries: z.array(
      z.object({
        year: z.string(),
        event: z.string(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
      })
    ).optional(),
    originalUrl: z.string().optional(),
  }),
});

// Boz Beat audio lessons — one entry per lesson (5 total from the scrape)
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    audioFile: z.string(),
    duration: z.string().optional(),
    summary: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
  }),
});

// Press section — articles (vintage articles, in-their-own-words, essays)
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    subhub: z.enum([
      'vintage',           // Vintage Boz Articles
      'in-their-own-words',// In Their Own Words
      'video',             // Boz Video Buz features
      'essay',             // What is Getting Bozzed / Why Bozzies.com
      'feature',           // longer-form featured pieces
    ]),
    publication: z.string().optional(),
    publicationDate: z.string().optional(),
    author: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    videoEmbed: z.string().optional(),
    externalLink: z.string().url().optional(),
    pullQuote: z.string().optional(),
    pullQuoteAttribution: z.string().optional(),
    order: z.number().optional(),
    originalUrl: z.string().optional(),
  }),
});

// Press releases — one entry per release (mostly PDF attachments)
const pressReleases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/press-releases' }),
  schema: z.object({
    title: z.string(),
    releaseDate: z.string().optional(),
    document: z.string().optional(),        // path to PDF/GIF in public/
    documentType: z.enum(['pdf', 'gif', 'image', 'html']).optional(),
    summary: z.string().optional(),
  }),
});

// Legacy section — tribute performers directory (one entry per performer)
const performers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/performers' }),
  schema: z.object({
    name: z.string(),
    region: z.string().optional(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    activeSince: z.string().optional(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).optional(),
  }),
});

// Legacy section — community features (Bozcasts, ASCAP scholar, Boz of the Month)
const legacyFeatures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legacy-features' }),
  schema: z.object({
    title: z.string(),
    subhub: z.enum(['bozcasts', 'ascap', 'boz-of-the-month', 'feature']),
    date: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    externalLink: z.string().url().optional(),
  }),
});

// Boz on the Charts — structured data (one entry per chart position)
// Simpler than the article-shaped collections above.
const chartEntries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chart-entries' }),
  schema: z.object({
    songTitle: z.string(),
    artist: z.enum(['boswell-sisters', 'connee-boswell']),
    year: z.number(),
    peakPosition: z.number().optional(),
    chart: z.string().optional(),
    notes: z.string().optional(),
  }),
});

// Site-wide settings — nav labels, contact email, footer copy
const siteSettings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site' }),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string().optional(),
    contactEmail: z.string().email().optional(),
    donateUrl: z.string().url().optional(),
    footerCredits: z.string().optional(),
  }),
});

export const collections = {
  pages,
  sisters,
  timelines,
  lessons,
  articles,
  pressReleases,
  performers,
  legacyFeatures,
  chartEntries,
  siteSettings,
};

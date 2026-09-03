import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Astro 7 Content Layer API: each collection declares a `loader`.
// Authors add Markdown/MDX files under the `base` directories below.

/** Article categories. An article may carry many tags but only one category. */
export const CATEGORIES = ['News', 'Feature', 'Interview', 'Profile', 'Explainer', 'Story'] as const;

/** Article languages. An article is written in exactly one language. */
export const LANGUAGES = ['CAT', 'ESP', 'ENG'] as const;

const blog = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/blog',
    // Keystatic saves each entry as <slug>/index.mdx; strip the index file so
    // entry ids (and URLs) stay clean: /blog/<slug>/.
    generateId: ({ entry }) =>
      entry
        .replace(/\/index\.(md|mdx)$/i, '')
        .replace(/\.(md|mdx)$/i, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      category: z.enum(CATEGORIES).default('News'),
      language: z.enum(LANGUAGES).default('ENG'),
      description: z.string(),
      draft: z.boolean().default(false),
      heroImage: image().optional(),
      heroImageCaption: z.string().optional(),
    }),
});

export const collections = { blog };

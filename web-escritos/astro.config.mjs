// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';
import { remarkReadingTime } from './remark-reading-time.mjs';
import rehypeFigureImages from './rehype-figure-images.mjs';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
// Keystatic's admin UI and API run on server routes (Node APIs) in development
// only. `npm run build` sets SKIP_KEYSTATIC=true and produces a static build
// (no adapter, `base: '/'`) which is what Netlify deploys.
const isProdBuild = process.env.SKIP_KEYSTATIC === 'true';

export default defineConfig({
  // Your deployed URL. Used for sitemap, canonical, and RSS links.
  site: 'https://laiaserradesanferm.netlify.app',
  base: '/',
  adapter: isProdBuild ? undefined : node({ mode: 'standalone' }),
  integrations: [
    mdx(),
    sitemap(),
    react(),
    ...(isProdBuild ? [] : [keystatic()]),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkMath],
    rehypePlugins: [rehypeFigureImages, rehypeKatex],
    // Dual Shiki themes; `defaultColor: false` emits CSS variables
    // (--shiki-light / --shiki-dark) so global.css can switch with the theme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: true,
    },
  },
});

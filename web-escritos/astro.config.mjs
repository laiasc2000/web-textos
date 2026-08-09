// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';
import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
// Keystatic's admin UI and API run on server routes (Node APIs). The site
// deploys as static files to GitHub Pages, so `npm run build` sets
// SKIP_KEYSTATIC=true and builds statically with the production `base`.
// In development (`astro dev`) the Keystatic routes are enabled, which needs
// server output and the Node adapter, and Keystatic hardcodes its API path at
// the root, so the dev `base` is dropped.
const isProdBuild = process.env.SKIP_KEYSTATIC === 'true';

export default defineConfig({
  // Change to your deployed URL. Used for sitemap, canonical, and RSS links.
  // For a GitHub Pages project site, `site` is the user/org domain and `base`
  // is the repository name. Drop `base` (or set it to '/') for a custom domain
  // or a `<user>.github.io` root site.
  site: 'https://kpab.github.io',
  base: isProdBuild ? '/astro-keel' : '/',
  adapter: isProdBuild ? undefined : node({ mode: 'standalone' }),
  integrations: [
    mdx(),
    sitemap(),
    react(),
    ...(isProdBuild ? [] : [keystatic()]),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    // Dual Shiki themes; `defaultColor: false` emits CSS variables
    // (--shiki-light / --shiki-dark) so global.css can switch with the theme.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: true,
    },
  },
});

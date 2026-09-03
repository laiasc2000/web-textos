// Site-wide settings. Edit this file to rebrand the theme — every page,
// the RSS feed, and Open Graph tags read from here.

export const SITE = {
  /** Site name — used in the header brand, <title>, and og:site_name. */
  title: 'Laia Serradesanferm | Science Journalist',
  /** Default meta description for pages that don't set their own. */
  description:
    'Science journalist and physicist specialized in fundamental science. Laia writes news, features, interviews, and science-inspired stories.',
  /** Description of the RSS feed at /rss.xml. */
  rssDescription:
    'Science journalist and physicist specialized in fundamental science. Laia writes news, features, interviews, and science-inspired stories.',
  /** Default social share image, relative to the site root (see public/). */
  ogImage: '/og.jpg',
  /** Footer credit line. */
  footerText: '© 2026 Laia Serradesanferm Córdoba. All rights reserved.',
  /** LinkedIn profile URL, shown as an icon in the site header. */
  linkedin: 'https://www.linkedin.com/in/laia-serradesanferm-c%C3%B3rdoba-391044271/',
} as const;

/** Header navigation. `href` is relative to the site root; the configured
 *  `base` is applied automatically via `withBase()`. */
export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  //{ href: '/works/', label: 'Works' },
  { href: '/blog/', label: 'Articles' },
  { href: '/search/', label: 'Search' },
] as const;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { withBase } from '../lib/url';
import { SITE } from '../consts';
import { markdownToText, renderMarkdown } from '../lib/markdown';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  const items = await Promise.all(
    posts.map(async (post) => ({
      title: post.data.title,
      description: await markdownToText(post.data.description),
      content: await renderMarkdown(post.data.description),
      pubDate: post.data.publishDate,
      link: withBase(`/blog/${post.id}/`),
      categories: post.data.tags,
    })),
  );

  return rss({
    title: SITE.title,
    description: SITE.rssDescription,
    site: context.site ?? 'https://example.com',
    items,
  });
}

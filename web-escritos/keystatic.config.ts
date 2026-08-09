import { config, collection, fields } from '@keystatic/core';

// Article categories — keep in sync with CATEGORIES in src/content.config.ts.
const CATEGORIES = [
  { label: 'News', value: 'News' },
  { label: 'Feature', value: 'Feature' },
  { label: 'Interview', value: 'Interview' },
  { label: 'Profile', value: 'Profile' },
  { label: 'Explainer', value: 'Explainer' },
  { label: 'Story', value: 'Story' },
] as const;

// Images are stored under src/assets so Astro can optimize them. The @assets
// alias (mapped in tsconfig.json) keeps the stored paths resolvable.
const imageOptions = {
  directory: 'src/assets/images/blog',
  publicPath: '@assets/images/blog/',
} as const;

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Laia Serradesanferm' },
  },
  collections: {
    blog: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'category', 'publishDate', 'draft'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        publishDate: fields.date({
          label: 'Publication date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Category',
          description: 'Used to filter articles on the blog page.',
          options: CATEGORIES,
          defaultValue: 'News',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag', validation: { isRequired: true } }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value || 'Tag',
            validation: { length: { max: 12 } },
          },
        ),
        description: fields.text({
          label: 'Description',
          description: 'One-line summary shown in listings, search and SEO.',
          multiline: true,
          validation: { isRequired: true },
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts are hidden from the live site.',
          defaultValue: false,
        }),
        heroImage: fields.image({
          label: 'Main image',
          description: 'Shown at the top of the article and on the home page.',
          ...imageOptions,
        }),
        content: fields.mdx({
          label: 'Content',
          options: {
            heading: [2, 3, 4] as const,
            bold: true,
            italic: true,
            strikethrough: true,
            code: true,
            codeBlock: true,
            blockquote: true,
            orderedList: true,
            unorderedList: true,
            link: true,
            table: true,
            divider: true,
            image: imageOptions,
          },
        }),
      },
    }),
  },
});

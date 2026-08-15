import { createMarkdownProcessor, type MarkdownRenderer } from '@astrojs/markdown-remark';

let processorPromise: Promise<MarkdownRenderer> | null = null;

function getProcessor(): Promise<MarkdownRenderer> {
  processorPromise ??= createMarkdownProcessor({
    // Descriptions never contain code blocks, so skip the highlighter setup.
    syntaxHighlight: false,
  });
  return processorPromise;
}

const hardBreakEnds = / {2,}$|\\$/;

// Single newlines in a description become soft line breaks in markdown (rendered
// as a space). For a short snippet that is rarely what the author intended, so
// promote every newline that is not a paragraph separator into a hard break.
function preserveLineBreaks(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const next = lines[i + 1];
    if (line.trim() === '' || next.trim() === '' || hardBreakEnds.test(line)) continue;
    lines[i] = `${line}  `;
  }
  return lines.join('\n');
}

/** Render a markdown string to HTML with Astro's default markdown pipeline. */
export async function renderMarkdown(markdown: string): Promise<string> {
  const processor = await getProcessor();
  const { code } = await processor.render(preserveLineBreaks(markdown));
  return code;
}

/** Strip markdown to plain text for meta tags, RSS descriptions and OG images. */
export async function markdownToText(markdown: string): Promise<string> {
  const html = await renderMarkdown(markdown);
  return html
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

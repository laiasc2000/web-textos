// Wraps every in-article image in a <figure> whose caption is the image alt
// text. Runs before Astro's image plugins (rehypeImages / rehypeImageToComponent)
// for both .md and .mdx content, so the inner <img> still gets processed.
//
// A paragraph that holds a single image is replaced by the figure entirely
// (markdown renders `![alt](src)` inside a <p>); otherwise the <img> is only
// wrapped when its parent is not a paragraph, to keep the HTML valid.

function walk(node, visit) {
  if (!node || !Array.isArray(node.children)) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child && typeof child.type === 'string') {
      if (visit(child, node, i) !== false) {
        walk(child, visit);
      }
    }
  }
}

function isWhitespace(node) {
  return node.type === 'text' && !/\S/.test(node.value);
}

function toFigure(img) {
  const alt = typeof img.properties?.alt === 'string' ? img.properties.alt : '';
  const figure = {
    type: 'element',
    tagName: 'figure',
    properties: {},
    children: [img],
  };
  if (alt) {
    figure.children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: [{ type: 'text', value: alt }],
    });
  }
  return figure;
}

export default function rehypeFigureImages() {
  return (tree) => {
    walk(tree, (node, parent, index) => {
      if (node.type === 'element' && node.tagName === 'p') {
        const imgs = node.children.filter((child) => child.type === 'element' && child.tagName === 'img');
        const onlyImage = imgs.length === 1 && node.children.every((child) => child === imgs[0] || isWhitespace(child));
        if (onlyImage) {
          parent.children[index] = toFigure(imgs[0]);
          return false;
        }
      }
      if (node.type === 'element' && node.tagName === 'img' && parent.tagName !== 'p') {
        parent.children[index] = toFigure(node);
        return false;
      }
    });
  };
}

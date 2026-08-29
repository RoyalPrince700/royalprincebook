const DEMO_MARKER = /\[\[DEMO:([a-z0-9-]+)\]\]/g;

export const parseChapterSegments = (markdown, markdownToHtml) => {
  const parts = markdown.split(DEMO_MARKER);
  const segments = [];

  for (let index = 0; index < parts.length; index += 1) {
    if (index % 2 === 0) {
      const chunk = parts[index]?.trim();
      if (!chunk) continue;
      const bodyMarkdown = chunk.replace(/^#\s+.+?\n+/, '');
      segments.push({
        type: 'html',
        content: markdownToHtml(bodyMarkdown)
      });
    } else {
      segments.push({
        type: 'demo',
        id: parts[index]
      });
    }
  }

  return segments;
};

// Backward-compatible alias
export const parseChapter4Segments = parseChapterSegments;

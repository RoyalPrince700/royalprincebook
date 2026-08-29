const escapeHtml = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const formatInline = (text) =>
  escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

const isTableRow = (line) => /^\|.+\|$/.test(line.trim());
const isTableSeparator = (line) => /^\|[\s:|-]+\|$/.test(line.trim());

const parseTable = (lines, startIndex) => {
  const rows = [];
  let index = startIndex;

  while (index < lines.length && isTableRow(lines[index])) {
    if (!isTableSeparator(lines[index])) {
      const cells = lines[index]
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => formatInline(cell.trim()));

      rows.push(cells);
    }
    index += 1;
  }

  if (rows.length === 0) {
    return { html: '', nextIndex: startIndex };
  }

  const [header, ...body] = rows;
  const headerHtml = header.map((cell) => `<th>${cell}</th>`).join('');
  const bodyHtml = body
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');

  return {
    html: `<div class="chapter-table-wrap"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`,
    nextIndex: index
  };
};

export const markdownToHtml = (markdown = '') => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(escapeHtml(lines[index]));
        index += 1;
      }

      const langAttr = language ? ` class="language-${language}"` : '';
      html.push(`<pre><code${langAttr}>${codeLines.join('\n')}</code></pre>`);
      index += 1;
      continue;
    }

    if (isTableRow(trimmed)) {
      const table = parseTable(lines, index);
      html.push(table.html);
      index = table.nextIndex;
      continue;
    }

    if (trimmed === '---') {
      html.push('<hr class="chapter-section-break" />');
      index += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      html.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      html.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      html.push(`<h1>${formatInline(trimmed.slice(2))}</h1>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      html.push(`<blockquote>${formatInline(trimmed.slice(2))}</blockquote>`);
      index += 1;
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items = [];

      while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
        items.push(`<li>${formatInline(lines[index].trim().replace(/^\d+\.\s/, ''))}</li>`);
        index += 1;
      }

      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const items = [];

      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(`<li>${formatInline(lines[index].trim().slice(2))}</li>`);
        index += 1;
      }

      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith('#') &&
      !lines[index].trim().startsWith('> ') &&
      !lines[index].trim().startsWith('- ') &&
      !/^\d+\.\s/.test(lines[index].trim()) &&
      lines[index].trim() !== '---' &&
      !lines[index].trim().startsWith('```') &&
      !isTableRow(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    html.push(`<p>${formatInline(paragraphLines.join(' '))}</p>`);
  }

  return html.join('\n');
};

export const countWords = (content = '') =>
  content
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

const { generateGeminiText, parseModelJson } = require('./gemini');

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const clip = (value, max) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);

const formatReportDate = (date = new Date()) =>
  `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const buildPrompt = (title, notes) => {
  const lines = notes.map((text, index) => `${index + 1}. ${text}`).join('\n');
  return `Turn these meeting sticky notes into a short report the note-taker can send after the meeting.

Board title: ${title || 'Untitled'}

Notes:
${lines}

Rules:
- Use only information present in the notes. Do not invent attendees, decisions, dates, or owners.
- Write in clear, professional English. Fix spelling and join fragmented notes into one coherent report.
- headline: a specific meeting title, 8 words or fewer. If the notes do not name the meeting, derive a plain title from the topic.
- summary: 2 to 4 sentences covering what was discussed and any decisions.
- highlights: up to 6 short points of the main topics or decisions. Use an empty array if the notes are too thin.
- actionItems: concrete follow-ups someone should do. owner is the person named in the notes, or "Unassigned" if nobody is named. due is the date or timeframe named in the notes, or "Not specified".
- Ignore notes that have no meeting content.

Return JSON with keys headline, summary, highlights, and actionItems. Each action item has task, owner, and due.`;
};

const normalizeReport = (parsed, { boardTitle, generatedAt }) => {
  const highlights = Array.isArray(parsed?.highlights)
    ? parsed.highlights.map((item) => clip(item, 240)).filter(Boolean).slice(0, 6)
    : [];

  const actionItems = Array.isArray(parsed?.actionItems)
    ? parsed.actionItems
        .map((item) => ({
          task: clip(item?.task, 280),
          owner: clip(item?.owner, 80) || 'Unassigned',
          due: clip(item?.due, 80) || 'Not specified'
        }))
        .filter((item) => item.task)
        .slice(0, 12)
    : [];

  const report = {
    headline: clip(parsed?.headline, 120) || boardTitle || 'Meeting report',
    summary: clip(parsed?.summary, 1200),
    highlights,
    actionItems,
    boardTitle: boardTitle || 'Untitled',
    generatedAt
  };

  if (!report.summary) {
    throw new Error('Model response was missing a summary');
  }

  report.text = formatReportText(report);
  return report;
};

const formatReportText = (report) => {
  const lines = [
    report.headline,
    '',
    report.boardTitle,
    report.generatedAt,
    '',
    'Summary',
    report.summary
  ];

  if (report.highlights.length) {
    lines.push('', 'Key points');
    report.highlights.forEach((point) => lines.push(`• ${point}`));
  }

  lines.push('', 'Action points');
  if (!report.actionItems.length) {
    lines.push('No action points were captured in these notes.');
  } else {
    report.actionItems.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.task}`);
      lines.push(`   Owner: ${item.owner}`);
      lines.push(`   Due: ${item.due}`);
    });
  }

  return lines.join('\n');
};

const summarizeMeetingNotes = async ({ title, notes }) => {
  const cleaned = (notes || []).map((text) => clip(text, 500)).filter(Boolean).slice(0, 80);
  if (!cleaned.length) {
    const error = new Error('Add some meeting notes on this board first.');
    error.status = 400;
    throw error;
  }

  const raw = await generateGeminiText(buildPrompt(title, cleaned), {
    temperature: 0.3,
    blockedMessage:
      'These notes could not be summarized. Try removing sensitive content and generate the report again.',
    emptyMessage: 'The AI returned an empty report. Try again.'
  });

  try {
    return normalizeReport(parseModelJson(raw), {
      boardTitle: clip(title, 120) || 'Untitled',
      generatedAt: formatReportDate()
    });
  } catch (parseError) {
    console.error('Meeting report parse error:', parseError.message);
    const error = new Error('The AI report could not be read. Try again.');
    error.status = 502;
    throw error;
  }
};

module.exports = {
  summarizeMeetingNotes,
  formatReportText,
  formatReportDate
};

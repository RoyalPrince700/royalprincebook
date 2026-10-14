const { generateGeminiText, parseModelJson } = require('./gemini');

const clipLine = (value, max) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);

const clipBlock = (value, max) =>
  String(value || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);

const fitTweet = (value) => {
  const text = clipLine(value, 600);
  if (text.length <= 280) return text;
  const cut = text.slice(0, 277);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > 180 ? cut.slice(0, lastSpace) : cut).trim();
  return `${trimmed}…`;
};

const hashtagToken = (value) => {
  const clean = String(value || '').replace(/^#/, '').replace(/[^a-zA-Z0-9_]/g, '');
  return clean ? `#${clean}` : '';
};

const appendHashtags = (text, tags, limit) => {
  const existing = new Set((text.match(/#[a-zA-Z0-9_]+/g) || []).map((tag) => tag.toLowerCase()));
  const extra = [];
  (Array.isArray(tags) ? tags : []).forEach((tag) => {
    const token = hashtagToken(tag);
    if (!token || existing.has(token.toLowerCase()) || extra.length >= limit) return;
    existing.add(token.toLowerCase());
    extra.push(token);
  });
  if (!extra.length) return text;
  return `${text}\n\n${extra.join(' ')}`.trim();
};

const PROFILE = `You are drafting social posts for Joseph Adesunkanmi (Royal Prince). Write in his voice: first person, plain, specific, and calm. He wants people to see that he is active and versatile. He does not want a biography in every post.

Who he is:
- Growth Officer at Accessible Publishers Limited, the parent company. He drives digital product adoption and growth strategy.
- He works across the group, not only the publishing company. Standalone brands include Smipay, a fintech product, and Oxygen FM, a radio station in Ibadan.
- Smipay, only when the task is clearly about that campus work: he led adoption at the University of Ibadan, met the Student Union executive, and secured a monthly partnership with the Student Union trade fair. About three editions have run. Users moved from 3,000+ to over 20,000+. Do not attach these numbers to any other kind of work.
- Oxygen FM, only when the task is about the station or the show: he hosts The Compass. The programme helps parents guide a child toward a career. Example he uses: if a child wants to become a doctor, parents should know the different areas of medical practice, that the child needs science, which subjects matter, and which university courses fit. Do not invent episodes or guests.
- He is a MERN developer (React, Node, Express, MongoDB). For the company he has built Accessible Knowledge Hub, a staff learning platform with a CRM for customer-service work, and a document studio the team uses to write official documents and PowerPoint decks. Talk about the outcome of tools like these, never the internal contents, customer records, or file names.
- He also builds and sells his own websites and templates, so developer posts can show that people can hire him. Public products include Flier Studio (ready-made flier templates), TestMancer (exam-prep platform, 3,000+ users), and Royal Prince Hub. Mention a product only when the task is about that product. A light note that he builds for clients is enough. Do not turn an internal company task into a sales pitch.
- Smart Edu Hub is an edtech product where he has worked on digital adoption. Mention it only when the task is about that product.`;

const buildPrompt = ({ task, related }) => {
  const relatedLines = related.length
    ? related
        .map((item, index) => `${index + 1}. ${item.title}${item.note ? ` — ${item.note}` : ''}`)
        .join('\n')
    : 'None.';

  return `${PROFILE}

Write three posts from the task below: LinkedIn, Twitter/X, and Instagram. LinkedIn matters most.

Task:
- Title: ${task.title}
- Tag: ${task.tag || 'None'}
- Status: ${task.status || 'started'}
- Notes: ${task.description || 'None'}
- Treat as internal: ${task.sensitive ? 'yes' : 'no, unless the notes themselves are internal'}

Other tasks with the same tag, for context only:
${relatedLines}

Privacy rules, follow all of them:
- Never reveal sensitive or internal information. That includes document text, file names, customer data, staff records, private numbers, unreleased pricing, credentials, internal complaints, negotiation details, and private strategy.
- If the task is an internal document, an internal tool, a private meeting, or anything marked internal, do not describe the contents. Talk about the kind of work, what it improves, and why that matters. Overview and implication only.
- Do not invent metrics, partners, attendees, or results. Use a number from the profile only when this task is clearly about that same public story.
- Related tasks are background. Do not list them, quote them, or combine private details from them into the post.
- Do not mention task boards, tags, notes, or that a draft was generated.
- Do not invent links, placeholder text such as [Link], or "link in bio". Only include a URL if it is already in the task.
- Do not name colleagues unless the task already treats them as public. Otherwise say "the team".
- One post, one slice of work. Do not recap every company he works with.

Voice:
- Sound like a person who did the work, not a brand account. No "excited to announce", no corporate filler, no emoji stacks.
- LinkedIn: 130 to 190 words. A clear story, the result or implication, and one short closing line. Put 3 relevant hashtags on their own line at the end.
- Twitter: one post, 280 characters or fewer including any hashtag. One sharp idea. No thread.
- Instagram: 70 to 120 words, short lines, conversational. Put 4 to 6 hashtags on their own line at the end.
- If the task is software he owns or a template he sells, it is fine to make clear he builds products people can hire him for.
- If the task is company growth, campus work, radio, or an internal tool, stay on that work.

Return JSON:
{
  "angle": "the public angle in one sentence",
  "sensitivity": "public or kept-high-level",
  "linkedin": { "text": "post without hashtags", "hashtags": ["Growth"] },
  "twitter": { "text": "full post, hashtags included only if they fit" },
  "instagram": { "text": "caption without hashtags", "hashtags": ["Growth"] }
}`;
};

const normalizePosts = (parsed) => {
  const sensitivity = parsed?.sensitivity === 'public' ? 'public' : 'kept-high-level';
  const linkedinBody = clipBlock(parsed?.linkedin?.text, 2200);
  const instagramBody = clipBlock(parsed?.instagram?.text, 1600);
  if (!linkedinBody || !instagramBody) {
    throw new Error('Model response was missing a post');
  }

  const linkedin = appendHashtags(linkedinBody, parsed?.linkedin?.hashtags, 4);
  const instagram = appendHashtags(instagramBody, parsed?.instagram?.hashtags, 6);
  const twitter = fitTweet(parsed?.twitter?.text);

  if (!twitter) {
    throw new Error('Model response was missing a post');
  }

  return {
    angle: clipLine(parsed?.angle, 180),
    sensitivity,
    linkedin: { text: linkedin },
    twitter: { text: twitter },
    instagram: { text: instagram }
  };
};

const createSocialPosts = async ({ task, related = [] }) => {
  const title = clipLine(task?.title, 160);
  if (!title) {
    const error = new Error('This task needs a title before a post can be written.');
    error.status = 400;
    throw error;
  }

  const payload = {
    task: {
      title,
      tag: clipLine(task.tag, 40),
      status: clipLine(task.status, 40),
      description: clipBlock(task.description, 1500),
      sensitive: Boolean(task.sensitive)
    },
    related: related
      .map((item) => ({
        title: clipLine(item.title, 160),
        note: clipLine(item.description, 220)
      }))
      .filter((item) => item.title)
      .slice(0, 6)
  };

  const raw = await generateGeminiText(buildPrompt(payload), {
    temperature: 0.6,
    blockedMessage: 'This task could not be turned into a post. Try a more general title.',
    emptyMessage: 'The AI returned an empty post. Try again.'
  });

  try {
    return normalizePosts(parseModelJson(raw));
  } catch (parseError) {
    console.error('Social post parse error:', parseError.message);
    const error = new Error('The social post could not be read. Try again.');
    error.status = 502;
    throw error;
  }
};

module.exports = {
  createSocialPosts
};

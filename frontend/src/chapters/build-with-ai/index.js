import chapter1Md from '../../../../content/build-with-ai/chapter1.md?raw';
import chapter2Md from '../../../../content/build-with-ai/chapter2.md?raw';
import chapter3Md from '../../../../content/build-with-ai/chapter3.md?raw';
import chapter4Md from '../../../../content/build-with-ai/chapter4.md?raw';
import chapter5Md from '../../../../content/build-with-ai/chapter5.md?raw';
import chapter6Md from '../../../../content/build-with-ai/chapter6.md?raw';
import chapter7Md from '../../../../content/build-with-ai/chapter7.md?raw';
import chapter8Md from '../../../../content/build-with-ai/chapter8.md?raw';
import chapter9Md from '../../../../content/build-with-ai/chapter9.md?raw';
import chapter10Md from '../../../../content/build-with-ai/chapter10.md?raw';
import chapter11Md from '../../../../content/build-with-ai/chapter11.md?raw';
import chapter12Md from '../../../../content/build-with-ai/chapter12.md?raw';
import chapter13Md from '../../../../content/build-with-ai/chapter13.md?raw';
import chapter14Md from '../../../../content/build-with-ai/chapter14.md?raw';
import glossaryMd from '../../../../content/build-with-ai/GLOSSARY.md?raw';
import buildWithAiCover from '../../assets/buildwithai.png';
import { markdownToHtml, countWords } from '../../utils/markdownToHtml';
import { parseChapterSegments } from './chapterSegments';
import { chapter4DemoMap } from './demos/Chapter4Demos';
import { chapter5DemoMap } from './demos/Chapter5Demos';
import { chapter6DemoMap } from './demos/Chapter6Demos';

const createChapter = (pageNumber, title, markdown) => {
  const bodyMarkdown = markdown.replace(/^#\s+.+?\n+/, '');
  const rawContent = markdownToHtml(bodyMarkdown);

  return {
    pageNumber,
    title,
    rawContent,
    formattedContent: rawContent,
    status: 'draft',
    wordCount: countWords(rawContent)
  };
};

const createInteractiveChapter = (pageNumber, title, markdown, demoMapKey) => {
  const segments = parseChapterSegments(markdown, markdownToHtml);
  const textOnly = segments
    .filter((segment) => segment.type === 'html')
    .map((segment) => segment.content)
    .join(' ');

  return {
    pageNumber,
    title,
    rawContent: textOnly,
    formattedContent: textOnly,
    status: 'draft',
    wordCount: countWords(textOnly),
    interactive: true,
    segments,
    demoMapKey
  };
};

export const buildWithAiBookData = {
  _id: 'local-build-with-ai',
  title: 'Build with AI: From Zero to Full-Stack Developer with Cursor',
  description:
    'A practical training guide for beginners who want to learn web development using the MERN stack and Cursor AI — from landing pages to full e-commerce applications.',
  genre: 'Technology / Web Development',
  price: 5000,
  status: 'draft',
  coverImage: buildWithAiCover,
  isLocal: true,
  pages: [
    createChapter(1, 'Chapter 1: The New Way to Build', chapter1Md),
    createChapter(2, 'Chapter 2: Your Toolkit & The MERN Stack', chapter2Md),
    createChapter(3, 'Chapter 3: Leveraging AI — Your Co-Pilot on the Build Journey', chapter3Md),
    createInteractiveChapter(
      4,
      'Chapter 4: Website Elements — Text, Icons, Fonts & Color',
      chapter4Md,
      'chapter4'
    ),
    createInteractiveChapter(
      5,
      'Chapter 5: Anatomy of a Website — See It, Then Build It',
      chapter5Md,
      'chapter5'
    ),
    createInteractiveChapter(
      6,
      'Chapter 6: DIY — Do It Yourself (Copy, Paste, Build)',
      chapter6Md,
      'chapter6'
    ),
    createChapter(7, 'Chapter 7: Think Wild — Build, Build, Build', chapter7Md),
    createChapter(8, 'Chapter 8: Vibe Coding With Eyes Open — Env Files, Auth & What AI Gets Wrong', chapter8Md),
    createChapter(9, 'Chapter 9: Deploying to the World — Run Locally, Git Push & Go Live', chapter9Md),
    createChapter(10, 'Chapter 10: Backend Anatomy — Routes, Models & Data Flow', chapter10Md),
    createChapter(11, 'Chapter 11: When Things Break — Debug Like a Builder', chapter11Md),
    createChapter(12, 'Chapter 12: Admin Dashboard — Manage What You Built', chapter12Md),
    createChapter(13, 'Chapter 13: Custom Domain & Cloudflare — Look Professional Online', chapter13Md),
    createChapter(14, 'Chapter 14: Your Next Build — Portfolio, Freelance & Keep Building', chapter14Md),
    createChapter(15, 'Appendix: Glossary — Terms Explained', glossaryMd)
  ]
};

export const chapterDemoMaps = {
  chapter4: chapter4DemoMap,
  chapter5: chapter5DemoMap,
  chapter6: chapter6DemoMap
};

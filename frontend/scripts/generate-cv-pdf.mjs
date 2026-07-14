import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../public/resume');
const outputFile = path.join(outputDir, 'royal-prince-cv.pdf');

const MARGIN = 54;
const PAGE_WIDTH = 612;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const COL_GAP = 24;
const COL_WIDTH = (CONTENT_WIDTH - COL_GAP) / 2;

const COLORS = {
  gold: '#B8860B',
  dark: '#1a1a1a',
  muted: '#444444',
  light: '#666666',
};

const cv = {
  name: 'OLOGUNDUDU JOSEPH ADESUNKANMI (ROYAL PRINCE)',
  title: 'Growth Officer | Product Builder | Operations & Growth Strategist',
  contact: [
    { label: 'Phone', value: '08160881705' },
    { label: 'Email', value: 'joseph.adesunkanmi@gmail.com' },
    { label: 'Location', value: 'Nigeria' },
  ],
  summary:
    'Growth and operations professional with proven experience building digital products, driving user acquisition, developing strategic partnerships, and leading high-impact initiatives. Experienced in managing cross-functional projects from concept to execution, developing growth systems, and solving operational challenges. Former Student Union President representing over 40,000 students, with a track record of taking ownership, building teams, and delivering measurable results across education, fintech, media, and technology.',
  experience: [
    {
      role: 'Growth Officer',
      company: 'Accessible Publishers Limited (APL)',
      period: '2026 – Present',
      intro:
        'Responsible for driving digital growth initiatives across multiple subsidiaries including Accessible Publishers, Smart Edu Hub, Smipay, and Oxygen FM.',
      bullets: [
        "Developed the ambassador strategy for driving nationwide adoption of Accessible Publishers' digital learning products.",
        'Designed growth initiatives focused on increasing awareness and adoption of educational technology products.',
        'Built the Accessible Knowledge Hub CRM platform for the CSR department to improve operational efficiency.',
        'Managed digital community growth and engagement for Smart Edu Hub.',
        'Developed digital marketing strategies to increase user acquisition and engagement.',
        'Collaborated across multiple business units to improve digital transformation initiatives.',
      ],
    },
    {
      role: 'Growth & Partnership Lead',
      company: 'Smipay',
      bullets: [
        'Leading market expansion and adoption strategy at the University of Ibadan.',
        "Facilitated strategic meetings with the University of Ibadan Students' Union Executive.",
        "Secured a partnership enabling Smipay's participation in monthly university trade fairs.",
        'Developing activation strategies to drive fintech adoption among students.',
      ],
    },
    {
      role: 'Growth & Media Strategist',
      company: 'Oxygen FM 96.9',
      subtitle: 'Host of The Compass (Every Wednesday, 3:00 PM – 4:00 PM)',
      bullets: [
        'Increased audience engagement through strategic programming.',
        'Secured high-value guests and strategic partners including regional business executives.',
        'Built relationships with organizations to expand programme reach.',
        'Leveraged media as a platform for education, leadership, and business conversations.',
      ],
    },
    {
      role: 'Digital Growth',
      company: 'Smart Edu Hub',
      bullets: [
        'Managing digital communities across multiple social platforms.',
        'Developing growth strategies to increase product adoption.',
        'Driving awareness campaigns for digital educational products.',
        'Supporting digital transformation initiatives within the organization.',
      ],
    },
  ],
  projects: [
    {
      name: 'TestMancer',
      role: 'Founder & Lead Developer',
      url: 'www.testmancer.com',
      bullets: [
        'Built and launched a comprehensive educational platform, successfully growing it to 3,000+ users.',
        'Designed and developed the entire web application, integrating modern technologies for scalability and performance.',
        'Technologies: React • Node.js • MongoDB • Express • Tailwind CSS',
      ],
    },
    {
      name: 'WifMart',
      role: 'Founder & Full-Stack Developer',
      url: 'www.wifmart.com',
      bullets: [
        'Built a complete e-commerce marketplace, designing both customer-facing and administrative backend systems.',
        'Developed secure payment flows and full marketplace logic from end to end.',
        'Technologies: React • Node.js • MongoDB • JavaScript',
      ],
    },
    {
      name: 'Accessible Knowledge Hub',
      role: 'Developer',
      url: 'www.accessibleknowledgehub.com',
      bullets: [
        'Designed and developed a custom CRM-enabled platform supporting CSR initiatives, improving digital management of educational outreach.',
      ],
    },
    {
      name: 'Website Development',
      bullets: [
        'Designed and developed multiple production-ready business websites and digital systems for corporate clients using modern web architecture.',
      ],
    },
  ],
  leadership: [
    {
      role: 'Student Union President',
      company: 'University of Ilorin',
      period: '2023 – 2024',
      intro: 'Represented more than 40,000 students as chief executive.',
      bullets: [
        'Led one of the largest student bodies within the country, coordinating executives, legislators, and diverse institutional stakeholders.',
        'Successfully negotiated major administrative and financial policies benefiting the general student body.',
        'Organized large-scale events, security frameworks, and institutional strategic engagements.',
        'Represented student interests directly before university top management and high-level external organizations.',
      ],
    },
  ],
  achievements: [
    'Built TestMancer from scratch to over 3,000 active users.',
    'Grew the Accessible Kids YouTube channel organically from 144 subscribers to over 1,040 subscribers in just three days.',
    'Developed and deployed the production-ready Accessible Knowledge Hub CRM platform.',
    'Secured high-conversion strategic partnership and activation opportunities for Smipay at the University of Ibadan.',
    'Successfully hosted and managed a weekly executive radio programme focused on leadership and corporate development.',
  ],
  skills: {
    left: {
      title: 'Growth, Strategy & Software',
      items: [
        'Growth Marketing & User Acquisition',
        'Partnership Development & Strategy',
        'Community Building & Management',
        'Full-Stack: JavaScript, React.js, Node.js',
        'Backend: Express.js, MongoDB, REST APIs',
        'Frontend: HTML5, CSS3, Tailwind CSS',
        'Digital Marketing, SEO & Google Analytics',
      ],
    },
    right: {
      title: 'Core Competencies & Creative',
      items: [
        'Ownership & Absolute Accountability',
        'Operations & Project Management',
        'Stakeholder Management & Public Speaking',
        'Strategic Thinking & Problem Solving',
        'Radio Presentation & Content Strategy',
        'Graphic Design & Photography',
        'Team Leadership & Adaptability',
      ],
    },
  },
  education: {
    degree: 'Bachelor of Agriculture (B.Agric.) — University of Ilorin',
    interests:
      'Technology • Product Building • Leadership • Education • Artificial Intelligence • Entrepreneurship • Media • Photography',
  },
};

function ensureSpace(doc, height = 40) {
  if (doc.y + height > doc.page.height - MARGIN) {
    doc.addPage();
    doc.y = MARGIN;
  }
}

function drawSectionHeader(doc, title) {
  ensureSpace(doc, 36);
  doc.moveDown(0.4);
  const y = doc.y;
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.dark)
    .text(title.toUpperCase(), MARGIN, y, { width: CONTENT_WIDTH });
  doc
    .moveTo(MARGIN, doc.y + 2)
    .lineTo(MARGIN + CONTENT_WIDTH, doc.y + 2)
    .lineWidth(0.75)
    .strokeColor(COLORS.gold)
    .stroke();
  doc.moveDown(0.6);
}

function drawParagraph(doc, text, options = {}) {
  ensureSpace(doc, 24);
  doc
    .font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
    .fontSize(options.size || 10)
    .fillColor(options.color || COLORS.muted)
    .text(text, MARGIN, doc.y, {
      width: CONTENT_WIDTH,
      align: options.align || 'left',
      lineGap: 2,
    });
  doc.moveDown(options.spacing || 0.3);
}

function drawRoleHeader(doc, role, period) {
  ensureSpace(doc, period ? 32 : 22);
  const startY = doc.y;

  if (period) {
    const periodWidth = 96;
    const roleWidth = CONTENT_WIDTH - periodWidth - 10;

    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(COLORS.dark);
    doc.text(role, MARGIN, startY, { width: roleWidth, lineGap: 1 });
    const roleEndY = doc.y;

    doc.font('Helvetica').fontSize(10).fillColor(COLORS.light);
    doc.text(period, MARGIN + roleWidth + 10, startY, {
      width: periodWidth,
      align: 'right',
      lineBreak: false,
    });

    doc.y = Math.max(roleEndY, startY + 12);
  } else {
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(COLORS.dark);
    doc.text(role, MARGIN, startY, { width: CONTENT_WIDTH, lineGap: 1 });
  }

  doc.moveDown(0.35);
}

function drawCompanyLine(doc, company, subtitle) {
  ensureSpace(doc, subtitle ? 32 : 18);
  const startY = doc.y;

  doc
    .font('Helvetica-BoldOblique')
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text(company, MARGIN, startY, { width: CONTENT_WIDTH, lineGap: 1 });
  let endY = doc.y;

  if (subtitle) {
    doc
      .font('Helvetica-Oblique')
      .fontSize(9.5)
      .fillColor(COLORS.light)
      .text(subtitle, MARGIN, endY + 2, { width: CONTENT_WIDTH, lineGap: 1 });
    endY = doc.y;
  }

  doc.y = endY;
  doc.moveDown(0.3);
}

function drawBullets(doc, bullets) {
  bullets.forEach((bullet) => {
    ensureSpace(doc, 20);
    const startY = doc.y;
    doc
      .font('Helvetica')
      .fontSize(9.5)
      .fillColor(COLORS.muted)
      .text(`•  ${bullet}`, MARGIN, startY, { width: CONTENT_WIDTH, lineGap: 1.5 });
    doc.moveDown(0.25);
  });
  doc.moveDown(0.2);
}

function drawProjectEntry(doc, project) {
  ensureSpace(doc, 28);
  const titleLine = project.url
    ? `${project.name} — ${project.role} (${project.url})`
    : `${project.name}${project.role ? ` — ${project.role}` : ''}`;
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(COLORS.dark)
    .text(titleLine, MARGIN, doc.y, { width: CONTENT_WIDTH, lineGap: 1 });
  doc.moveDown(0.15);
  drawBullets(doc, project.bullets);
}

function drawTwoColumnSkills(doc, left, right) {
  ensureSpace(doc, 140);
  const startY = doc.y;
  const leftX = MARGIN;
  const rightX = MARGIN + COL_WIDTH + COL_GAP;

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.dark);
  doc.text(left.title, leftX, startY, { width: COL_WIDTH });
  const leftTitleHeight = doc.heightOfString(left.title, { width: COL_WIDTH });
  let leftY = startY + leftTitleHeight + 6;

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.dark);
  doc.text(right.title, rightX, startY, { width: COL_WIDTH });
  const rightTitleHeight = doc.heightOfString(right.title, { width: COL_WIDTH });
  let rightY = startY + rightTitleHeight + 6;

  left.items.forEach((item) => {
    doc.font('Helvetica').fontSize(9).fillColor(COLORS.muted);
    const height = doc.heightOfString(`• ${item}`, { width: COL_WIDTH - 8, lineGap: 1 });
    doc.text(`• ${item}`, leftX + 4, leftY, { width: COL_WIDTH - 8, lineGap: 1 });
    leftY += height + 3;
  });

  right.items.forEach((item) => {
    doc.font('Helvetica').fontSize(9).fillColor(COLORS.muted);
    const height = doc.heightOfString(`• ${item}`, { width: COL_WIDTH - 8, lineGap: 1 });
    doc.text(`• ${item}`, rightX + 4, rightY, { width: COL_WIDTH - 8, lineGap: 1 });
    rightY += height + 3;
  });

  doc.y = Math.max(leftY, rightY) + 6;
}

function generateCvPdf() {
  fs.mkdirSync(outputDir, { recursive: true });

  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    info: {
      Title: 'Royal Prince CV',
      Author: 'Ologundudu Joseph Adesunkanmi',
      Subject: 'Curriculum Vitae',
    },
  });

  const stream = fs.createWriteStream(outputFile);
  doc.pipe(stream);

  // Header
  doc
    .font('Helvetica-Bold')
    .fontSize(15)
    .fillColor(COLORS.dark)
    .text(cv.name, MARGIN, MARGIN, { width: CONTENT_WIDTH, align: 'center' });

  doc.moveDown(0.35);
  doc
    .font('Helvetica')
    .fontSize(10.5)
    .fillColor(COLORS.muted)
    .text(cv.title, { width: CONTENT_WIDTH, align: 'center' });

  doc.moveDown(0.45);
  const contactLine = cv.contact.map(({ label, value }) => `${label}: ${value}`).join('   |   ');
  doc
    .font('Helvetica')
    .fontSize(9.5)
    .fillColor(COLORS.light)
    .text(contactLine, { width: CONTENT_WIDTH, align: 'center' });

  doc
    .moveTo(MARGIN, doc.y + 10)
    .lineTo(MARGIN + CONTENT_WIDTH, doc.y + 10)
    .lineWidth(1)
    .strokeColor(COLORS.gold)
    .stroke();
  doc.moveDown(1.2);

  // Professional Summary
  drawSectionHeader(doc, 'Professional Summary');
  drawParagraph(doc, cv.summary);

  // Professional Experience
  drawSectionHeader(doc, 'Professional Experience');
  cv.experience.forEach((job, index) => {
    if (index > 0) {
      doc.moveDown(0.35);
    }
    drawRoleHeader(doc, job.role, job.period);
    drawCompanyLine(doc, job.company, job.subtitle);
    if (job.intro) {
      drawParagraph(doc, job.intro, { size: 9.5, spacing: 0.25 });
    }
    drawBullets(doc, job.bullets);
  });

  // Selected Projects
  drawSectionHeader(doc, 'Selected Projects');
  cv.projects.forEach((project) => drawProjectEntry(doc, project));

  // Leadership Experience
  drawSectionHeader(doc, 'Leadership Experience');
  cv.leadership.forEach((item) => {
    drawRoleHeader(doc, item.role, item.period);
    drawCompanyLine(doc, item.company);
    if (item.intro) {
      drawParagraph(doc, item.intro, { size: 9.5, spacing: 0.2 });
    }
    drawBullets(doc, item.bullets);
  });

  // Key Achievements
  drawSectionHeader(doc, 'Key Achievements');
  drawBullets(doc, cv.achievements);

  // Technical Skills
  drawSectionHeader(doc, 'Technical Skills & Core Competencies');
  drawTwoColumnSkills(doc, cv.skills.left, cv.skills.right);

  // Education & Interests
  drawSectionHeader(doc, 'Education & Interests');
  drawParagraph(doc, cv.education.degree, { bold: true, color: COLORS.dark, size: 10 });
  drawParagraph(doc, `Interests: ${cv.education.interests}`, { size: 9.5 });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`Created ${outputFile}`);
      resolve(outputFile);
    });
    stream.on('error', reject);
  });
}

generateCvPdf().catch((error) => {
  console.error('Failed to generate CV PDF:', error);
  process.exit(1);
});

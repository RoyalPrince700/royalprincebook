import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../public/resume');
const outputFile = path.join(outputDir, 'royal-prince-cv.pdf');

const cvLines = [
  'ROYAL PRINCE',
  '',
  'Growth Officer | Software Engineer | Product Builder | Community Strategist',
  'contact@royalprincehub.com | royalprincehub.com/portfolio',
  'LinkedIn: linkedin.com/in/royalprince | GitHub: github.com/royalprince',
  '',
  'SUMMARY',
  'Growth Officer, Software Engineer, Product Builder, and Community Strategist',
  'passionate about building digital products, solving business problems, and',
  'creating meaningful impact.',
  '',
  'EXPERIENCE',
  'Growth Officer (2026 - Present) - Driving growth across edtech, fintech, and media.',
  'Radio Host, Oxygen FM - The Compass (2026 - Present) - Leadership-focused media.',
  'Student Activation Officer, Facity (2023 - Present) - Campus activation and onboarding.',
  'Product Builder (2023 - Present) - Full-stack products from idea to production.',
  'Student Union President, University of Ilorin (2022 - 2023) - Led 40,000+ students.',
  'Founder - Building ventures across technology, education, and media.',
  '',
  'FEATURED PROJECTS',
  'TestMancer - Educational platform serving 3,000+ users.',
  'WifMart - Full-featured e-commerce marketplace.',
  'Accessible Knowledge Hub - CRM and CSR platform for Accessible Publishers.',
  'Smipay - Fintech platform for airtime, data, bills, and payments.',
  'Royal Prince Hub - Book platform, blog, and personal brand hub.',
  '',
  'SKILLS',
  'Software: React, Node.js, Express, MongoDB, JavaScript, Tailwind, Git',
  'Growth: SEO, Google Analytics, Growth Strategy, Community Building',
  'Leadership: Public Speaking, Stakeholder Management, Operations',
  'Photography: Adobe Lightroom, Camera Operation, Editing',
  '',
  'IMPACT',
  '40,000+ students represented | 3,000+ TestMancer users',
  '1,040+ Accessible Kids subscribers grown from 144 in three days',
  '10+ production websites built | Multiple strategic partnerships secured'
];

const escapePdfText = (text) =>
  text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const fontSize = 11;
const titleSize = 20;
const sectionSize = 13;
const lineHeight = 16;
const startX = 54;
const startY = 760;

const contentLines = [];
let y = startY;

cvLines.forEach((line) => {
  if (line === 'ROYAL PRINCE') {
    contentLines.push(`BT /F2 ${titleSize} Tf ${startX} ${y} Td (${escapePdfText(line)}) Tj ET`);
    y -= 28;
    return;
  }

  if (['SUMMARY', 'EXPERIENCE', 'FEATURED PROJECTS', 'SKILLS', 'IMPACT'].includes(line)) {
    y -= 6;
    contentLines.push(`BT /F2 ${sectionSize} Tf ${startX} ${y} Td (${escapePdfText(line)}) Tj ET`);
    y -= lineHeight + 2;
    return;
  }

  if (line === '') {
    y -= 8;
    return;
  }

  contentLines.push(`BT /F1 ${fontSize} Tf ${startX} ${y} Td (${escapePdfText(line)}) Tj ET`);
  y -= lineHeight;
});

const stream = `${contentLines.join('\n')}\n`;
const streamLength = Buffer.byteLength(stream, 'utf8');

const objects = [
  '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
  '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
  '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n',
  '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
  `6 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}endstream\nendobj\n`
];

let pdf = '%PDF-1.4\n';
const offsets = [0];

objects.forEach((object) => {
  offsets.push(Buffer.byteLength(pdf, 'utf8'));
  pdf += object;
});

const xrefOffset = Buffer.byteLength(pdf, 'utf8');
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += '0000000000 65535 f \n';

for (let i = 1; i <= objects.length; i += 1) {
  pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
}

pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, pdf, 'utf8');

console.log(`Created ${outputFile}`);

const express = require('express');
const router = express.Router();
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Footer, PageNumber, AlignmentType } = require('docx');
const PDFDocument = require('pdfkit');
const Book = require('../models/Book');
const { authenticateToken } = require('../middleware/auth');

// Helper to strip HTML tags and decode entities
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Remove tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

// Helper for formatted text content extraction (preserves paragraphs)
const formatContent = (html) => {
  if (!html) return '';
  // Replace block tags with newlines
  let text = html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n');
    
  // Strip remaining tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Decode entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
    
  return text.trim();
};

// Export book as DOCX
router.get('/docx/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId).populate('author', 'username');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check permissions
    if (book.author._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Sort pages by page number
    const sortedPages = book.pages.sort((a, b) => a.pageNumber - b.pageNumber);

    // Create DOCX document
    const doc = new Document({
      sections: [{
        properties: {},
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ["Page ", PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Title page
          new Paragraph({
            text: book.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400, before: 3000 } // Add some top margin/spacing
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `By: ${book.author.username}`,
                italics: true,
                size: 28
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 }
          }),
          
          // Page Break after title
          new Paragraph({
             children: [new TextRun({ break: 1 })], // Simple break for now, ideally PageBreak()
             pageBreakBefore: true
          }),

          // Description
          ...(book.description ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: book.description,
                  size: 24
                })
              ],
              spacing: { after: 400 }
            })
          ] : []),
          // Table of Contents placeholder
          new Paragraph({
            text: "Table of Contents",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          ...sortedPages.map(page => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${page.pageNumber}. ${page.title || 'Untitled Chapter'}`,
                })
              ]
            })
          ),
          
          // Page Break
          new Paragraph({
             children: [new TextRun({ break: 1 })],
             pageBreakBefore: true
          }),

          // Content pages
          ...sortedPages.flatMap(page => [
            // Page title
            ...(page.title ? [
              new Paragraph({
                text: page.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
                pageBreakBefore: true
              })
            ] : []),
            // Page content
            new Paragraph({
              text: stripHtml(page.formattedContent || page.rawContent),
              spacing: { after: 200 }
            })
          ])
        ]
      }]
    });

    // Generate and send file
    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx"`);
    res.send(buffer);

  } catch (error) {
    console.error('DOCX export error:', error);
    res.status(500).json({ message: 'Server error during export' });
  }
});

// Export book as PDF
router.get('/pdf/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId).populate('author', 'username');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check permissions
    if (book.author._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Sort pages by page number
    const sortedPages = book.pages.sort((a, b) => a.pageNumber - b.pageNumber);

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 72, // 1 inch margins for professional look
      bufferPages: true // Enable bufferPages to access all pages later for numbering
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Fonts setup
    // Using standard fonts but applying them strategically
    const fonts = {
      title: 'Helvetica-Bold', // Modern bold for main titles
      chapterTitle: 'Helvetica-Bold', // Modern bold for chapter titles
      chapterSubtitle: 'Helvetica', // Clean sans-serif for "Chapter N"
      body: 'Times-Roman', // Classic serif for body text (like Rich Dad Poor Dad)
      toc: 'Helvetica' // Clean TOC
    };

    // --- Title Page ---
    doc.moveDown(8);
    
    // Main Title
    doc.font(fonts.title)
       .fontSize(36)
       .text(book.title.toUpperCase(), { 
         align: 'center',
         characterSpacing: 1 // Slight tracking for elegance
       });
       
    doc.moveDown(1);
    
    // Author
    doc.font(fonts.chapterSubtitle)
       .fontSize(14)
       .text(`By ${book.author.username}`, { 
         align: 'center',
         color: '#444444' 
       });
    
    // Decorative line
    doc.moveDown(2);
    doc.moveTo(doc.page.width / 2 - 50, doc.y)
       .lineTo(doc.page.width / 2 + 50, doc.y)
       .strokeColor('#cccccc')
       .stroke();
       
    if (book.description) {
        doc.moveDown(4);
        doc.font(fonts.body)
           .fontSize(12)
           .text(book.description, { 
             align: 'center',
             width: 400,
             align: 'center' // Actually center aligned
           });
    }

    // --- Table of Contents ---
    doc.addPage();
    doc.font(fonts.chapterTitle)
       .fontSize(16)
       .text("CONTENTS", { align: 'center', characterSpacing: 2 });
       
    doc.moveDown(3);
    doc.font(fonts.toc).fontSize(11);
    
    sortedPages.forEach(page => {
        const title = page.title || 'Untitled Chapter';
        doc.text(`Chapter ${page.pageNumber}`, { continued: true });
        doc.text(title, { align: 'right' }); // Basic right align
        doc.moveDown(1);
    });

    // --- Content Pages ---
    sortedPages.forEach((page, index) => {
      doc.addPage();

      // Chapter Header Style
      doc.moveDown(4); // Start lower on the page
      
      // "CHAPTER ONE" style
      doc.font(fonts.chapterSubtitle)
         .fontSize(10)
         .fillColor('#666666')
         .text(`CHAPTER ${page.pageNumber}`, { 
           align: 'center',
           characterSpacing: 2
         });
         
      doc.moveDown(1);
      
      // Chapter Title
      if (page.title) {
        doc.font(fonts.chapterTitle)
           .fontSize(24)
           .fillColor('black')
           .text(page.title.toUpperCase(), { 
             align: 'center',
             lineGap: 10
           });
      }
      
      doc.moveDown(3);

      // Content
      const content = formatContent(page.formattedContent || page.rawContent);
      
      doc.font(fonts.body)
         .fontSize(12)
         .text(content, {
           align: 'justify', // Justified text is key for "book" look
           lineGap: 4, // More breathing room
           indent: 0, // Block paragraphs look cleaner with spacing
           paragraphGap: 10 // Space between paragraphs
         });
    });

    // --- Add Page Numbers ---
    const range = doc.bufferedPageRange(); // { start: 0, count: total }
    for (let i = range.start; i < range.start + range.count; i++) {
        // Skip title page (page 0)
        if (i > 0) {
            doc.switchToPage(i);
            
            // Footer Style
            doc.font(fonts.chapterSubtitle)
               .fontSize(9)
               .fillColor('#888888')
               .text(
                `${i}`, 
                50, 
                doc.page.height - 50, 
                { align: 'center', width: doc.page.width - 100 }
            );
        }
    }

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Server error during export' });
  }
});

module.exports = router;
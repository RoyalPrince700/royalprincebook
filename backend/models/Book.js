const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  rawContent: {
    type: String,
    required: true
  },
  formattedContent: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'published'],
    default: 'draft'
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  wordCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pages: [pageSchema],
  genre: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'review', 'completed', 'published'],
    default: 'draft'
  },
  coverImage: {
    type: String // URL or path to cover image
  },
  totalWordCount: {
    type: Number,
    default: 0
  },
  lastEditedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update word count before saving
bookSchema.pre('save', async function() {
  if (this.pages && this.pages.length > 0) {
    this.totalWordCount = this.pages.reduce((total, page) => {
      return total + (page.wordCount || 0);
    }, 0);
  }
  this.lastEditedAt = new Date();
});

// Index for efficient queries
bookSchema.index({ author: 1, status: 1 });
bookSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
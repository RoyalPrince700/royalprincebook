const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Book = require('../models/Book');
const User = require('../models/User');

const demoBooks = [
  {
    title: "Academic Excellence",
    description: "Strategies for achieving top grades and mastering your field of study.",
    genre: "Academics",
    status: "published",
    coverImage: "https://placehold.co/300x450/e9ecef/333333?text=Academic+Excellence",
    pages: [
      { pageNumber: 1, title: "Introduction", rawContent: "<p>Welcome to Academic Excellence...</p>", formattedContent: "<p>Welcome to Academic Excellence...</p>", status: "approved" }
    ]
  },
  {
    title: "The Art of Research",
    description: "A comprehensive guide to conducting meaningful and impactful research.",
    genre: "Academics",
    status: "published",
    coverImage: "https://placehold.co/300x450/e9ecef/333333?text=Art+of+Research",
    pages: [
        { pageNumber: 1, title: "Getting Started", rawContent: "<p>Research begins with a question...</p>", formattedContent: "<p>Research begins with a question...</p>", status: "approved" }
    ]
  },
  {
    title: "Study Smart, Not Hard",
    description: "Efficiency techniques for the modern student.",
    genre: "Academics",
    status: "published",
    coverImage: "https://placehold.co/300x450/e9ecef/333333?text=Study+Smart",
    pages: [
        { pageNumber: 1, title: "Time Management", rawContent: "<p>Time is your most valuable resource...</p>", formattedContent: "<p>Time is your most valuable resource...</p>", status: "approved" }
    ]
  },
  {
    title: "Understanding Love Languages",
    description: "How to communicate love effectively in your relationships.",
    genre: "Relationship",
    status: "published",
    coverImage: "https://placehold.co/300x450/e9ecef/333333?text=Love+Languages",
    pages: [
        { pageNumber: 1, title: "The Five Languages", rawContent: "<p>Love is spoken in many ways...</p>", formattedContent: "<p>Love is spoken in many ways...</p>", status: "approved" }
    ]
  },
  {
    title: "Building Lasting Trust",
    description: "The foundation of every strong relationship.",
    genre: "Relationship",
    status: "published",
    coverImage: "https://placehold.co/300x450/e9ecef/333333?text=Building+Trust",
    pages: [
        { pageNumber: 1, title: "What is Trust?", rawContent: "<p>Trust is the glue that holds relationships together...</p>", formattedContent: "<p>Trust is the glue that holds relationships together...</p>", status: "approved" }
    ]
  }
];

const seedDemoBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a user to assign the books to (preferably admin, but any user works for demo)
    // We try to find a user with role 'admin' first, if not, any user.
    let user = await User.findOne({ role: 'admin' });
    if (!user) {
        user = await User.findOne();
    }
    
    if (!user) {
      console.error('No user found! Please register a user first via the app.');
      process.exit(1);
    }

    console.log(`Assigning books to user: ${user.username} (${user.role})`);

    for (const bookData of demoBooks) {
        // Check if book already exists
        let book = await Book.findOne({ title: bookData.title });

        if (book) {
            console.log(`Book "${bookData.title}" already exists. Updating...`);
            book.description = bookData.description;
            book.genre = bookData.genre;
            book.coverImage = bookData.coverImage;
            book.pages = bookData.pages;
            await book.save();
        } else {
            console.log(`Creating book "${bookData.title}"...`);
            book = new Book({
            ...bookData,
            author: user._id
            });
            await book.save();
        }
    }

    console.log('Demo books seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

seedDemoBooks();

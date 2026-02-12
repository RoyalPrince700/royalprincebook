const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Book = require('../models/Book');

const listBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const books = await Book.find({}, 'title _id author');
    console.log('Books found:', books.length);
    books.forEach(b => {
      console.log(`- Title: ${b.title}, ID: ${b._id}, Author: ${b.author}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listBooks();

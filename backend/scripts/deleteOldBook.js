const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Book = require('../models/Book');

const deleteOldBook = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const oldBookId = '6981e96d229cfe3b9b888cbf';
    const result = await Book.findByIdAndDelete(oldBookId);

    if (result) {
      console.log('Successfully deleted old book:', result.title);
    } else {
      console.log('Old book not found.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

deleteOldBook();

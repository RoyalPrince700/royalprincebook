const PRELAUNCH_BOOK_MATCHERS = ['leading from within', 'leadership from within'];
const PRELAUNCH_PRICE = 1000;
const POST_LAUNCH_PRICE = 2000;

const isPrelaunchBook = (book) => {
  const title = (book?.title || '').toLowerCase();
  return PRELAUNCH_BOOK_MATCHERS.some((matcher) => title.includes(matcher));
};

const getEffectiveBookPrice = (book) => {
  if (isPrelaunchBook(book)) {
    return PRELAUNCH_PRICE;
  }

  return book?.price || 0;
};

const applyEffectivePrice = (book) => {
  if (!book) {
    return book;
  }

  const nextPrice = getEffectiveBookPrice(book);

  if (typeof book.toObject === 'function') {
    return {
      ...book.toObject(),
      price: nextPrice
    };
  }

  return {
    ...book,
    price: nextPrice
  };
};

module.exports = {
  PRELAUNCH_PRICE,
  POST_LAUNCH_PRICE,
  getEffectiveBookPrice,
  applyEffectivePrice,
  isPrelaunchBook
};

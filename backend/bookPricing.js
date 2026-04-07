const LAUNCH_OFFER_BOOK_MATCHERS = ['leading from within', 'leadership from within'];
const LAUNCH_OFFER_PRICE = 1000;
const POST_LAUNCH_PRICE = 2000;

const isLaunchOfferBook = (book) => {
  const title = (book?.title || '').toLowerCase();
  return LAUNCH_OFFER_BOOK_MATCHERS.some((matcher) => title.includes(matcher));
};

const getEffectiveBookPrice = (book) => {
  if (isLaunchOfferBook(book)) {
    return LAUNCH_OFFER_PRICE;
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
  LAUNCH_OFFER_PRICE,
  POST_LAUNCH_PRICE,
  getEffectiveBookPrice,
  applyEffectivePrice,
  isLaunchOfferBook
};

const User = require('../models/User');
const Book = require('../models/Book');
const { LOCAL_BOOK_ALIASES, resolveBookByIdOrAlias, findAliasByKey } = require('./bookAliases');
const { getEffectiveBookPrice } = require('../bookPricing');

const CATALOG_BOOKS = [
  {
    localId: 'local-leading-from-within',
    title: 'Leading from Within: Mastering Self to Impact Others',
    description: 'A guide on how mastering self-leadership is the foundation for leading others and achieving success.',
    genre: 'Leadership / Self-Development',
    price: 1000,
    status: 'published'
  },
  {
    localId: 'local-build-with-ai',
    title: 'Build with AI: From Zero to Full-Stack Developer with Cursor',
    description:
      'A practical training guide for beginners who want to learn web development using the MERN stack and Cursor AI — from landing pages to full e-commerce applications.',
    genre: 'Technology / Web Development',
    price: 5000,
    status: 'published'
  }
];

const findCatalogDefinition = (bookId) => {
  const direct = CATALOG_BOOKS.find((entry) => entry.localId === bookId);
  if (direct) {
    return direct;
  }

  const alias = findAliasByKey(bookId);
  if (!alias) {
    return null;
  }

  return CATALOG_BOOKS.find((entry) => entry.localId === alias.localId) || null;
};

const findBookByCatalogTitle = async (title) => {
  const alias = LOCAL_BOOK_ALIASES.find((entry) => entry.matchTitle(title));
  if (alias) {
    const books = await Book.find({}, 'title price author status description genre');
    return books.find((book) => alias.matchTitle(book.title)) || null;
  }

  return Book.findOne({ title });
};

const syncCatalogBookPrice = async (book, definition) => {
  if (!book || !definition || typeof definition.price !== 'number') {
    return book;
  }

  if (Number(book.price) === Number(definition.price)) {
    return book;
  }

  book.price = definition.price;
  await Book.findByIdAndUpdate(book._id, { price: definition.price });
  return book;
};

const getCatalogAuthorId = async () => {
  const admin = await User.findOne({ role: 'admin' }).select('_id');
  if (admin?._id) {
    return admin._id;
  }

  const anyUser = await User.findOne().select('_id');
  return anyUser?._id || null;
};

const ensureCatalogBook = async (bookId) => {
  const definition = findCatalogDefinition(bookId);
  const resolved = await resolveBookByIdOrAlias(bookId, Book);
  if (resolved) {
    const matchedDefinition =
      definition ||
      CATALOG_BOOKS.find((entry) => {
        const alias = LOCAL_BOOK_ALIASES.find((item) => item.localId === entry.localId);
        return alias?.matchTitle(resolved.title) || entry.title === resolved.title;
      });

    return syncCatalogBookPrice(resolved, matchedDefinition);
  }

  if (!definition) {
    return null;
  }

  const existing = await findBookByCatalogTitle(definition.title);
  if (existing) {
    return syncCatalogBookPrice(existing, definition);
  }

  const author = await getCatalogAuthorId();
  if (!author) {
    return null;
  }

  return Book.create({
    title: definition.title,
    description: definition.description,
    genre: definition.genre,
    price: definition.price,
    status: definition.status,
    author,
    pages: []
  });
};

const ensureCatalogBooks = async () => {
  const results = [];
  for (const entry of CATALOG_BOOKS) {
    results.push(await ensureCatalogBook(entry.localId));
  }
  return results.filter(Boolean);
};

const getRequiredBookAmount = (book) => getEffectiveBookPrice(book);

module.exports = {
  CATALOG_BOOKS,
  ensureCatalogBook,
  ensureCatalogBooks,
  getRequiredBookAmount
};

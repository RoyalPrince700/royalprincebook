const mongoose = require('mongoose');

const LOCAL_BOOK_ALIASES = [
  {
    localId: 'local-build-with-ai',
    matchTitle: (title) => /build with ai/i.test(title || '')
  },
  {
    localId: 'local-leading-from-within',
    matchTitle: (title) =>
      /leading from within|leadership from within|leading from withing/i.test(title || '')
  }
];

const getLocalAliasIdsForTitle = (title) =>
  LOCAL_BOOK_ALIASES.filter(({ matchTitle }) => matchTitle(title)).map(({ localId }) => localId);

const expandBookAccessIds = (bookIds = [], booksWithTitles = []) => {
  const ids = new Set(bookIds.map((id) => String(id)));

  for (const book of booksWithTitles) {
    getLocalAliasIdsForTitle(book.title).forEach((aliasId) => ids.add(aliasId));
  }

  return Array.from(ids);
};

const resolveBookByIdOrAlias = async (bookId, Book) => {
  if (!bookId) {
    return null;
  }

  const alias = LOCAL_BOOK_ALIASES.find((entry) => entry.localId === bookId);
  if (alias) {
    const books = await Book.find({}, 'title price author');
    return books.find((book) => alias.matchTitle(book.title)) || null;
  }

  if (mongoose.Types.ObjectId.isValid(bookId)) {
    return Book.findById(bookId);
  }

  return null;
};

module.exports = {
  LOCAL_BOOK_ALIASES,
  getLocalAliasIdsForTitle,
  expandBookAccessIds,
  resolveBookByIdOrAlias
};

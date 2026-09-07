const mongoose = require('mongoose');

const LOCAL_BOOK_ALIASES = [
  {
    localId: 'local-build-with-ai',
    slug: 'build-with-ai',
    slugAliases: ['build-with-ai', 'local-build-with-ai'],
    matchTitle: (title) => /build with ai/i.test(title || '')
  },
  {
    localId: 'local-leading-from-within',
    slug: 'leading-from-within',
    slugAliases: [
      'leading-from-within',
      'leadership-from-within',
      'local-leading-from-within'
    ],
    matchTitle: (title) =>
      /leading from within|leadership from within|leading from withing/i.test(title || '')
  }
];

const slugifyBookTitle = (title = '') =>
  String(title)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const normalizeBookKey = (value = '') => String(value || '').trim().toLowerCase();

const getLocalAliasIdsForTitle = (title) =>
  LOCAL_BOOK_ALIASES.filter(({ matchTitle }) => matchTitle(title)).map(({ localId }) => localId);

const expandBookAccessIds = (bookIds = [], booksWithTitles = []) => {
  const ids = new Set(bookIds.map((id) => String(id)));

  for (const book of booksWithTitles) {
    getLocalAliasIdsForTitle(book.title).forEach((aliasId) => ids.add(aliasId));
  }

  return Array.from(ids);
};

const findAliasByKey = (bookKey) => {
  const normalized = normalizeBookKey(bookKey);
  if (!normalized) {
    return null;
  }

  return (
    LOCAL_BOOK_ALIASES.find(
      (entry) =>
        entry.localId === normalized ||
        entry.slug === normalized ||
        (entry.slugAliases || []).includes(normalized)
    ) || null
  );
};

const resolveBookByIdOrAlias = async (bookId, Book) => {
  if (!bookId) {
    return null;
  }

  const alias = findAliasByKey(bookId);
  if (alias) {
    const books = await Book.find({}, 'title price author description genre status pages updatedAt createdAt purchaseCount revenue');
    return books.find((book) => alias.matchTitle(book.title)) || null;
  }

  if (mongoose.Types.ObjectId.isValid(bookId) && String(bookId).length === 24) {
    return Book.findById(bookId);
  }

  const slug = normalizeBookKey(bookId);
  if (!slug) {
    return null;
  }

  const books = await Book.find({}, 'title price author description genre status pages updatedAt createdAt purchaseCount revenue');
  return books.find((book) => slugifyBookTitle(book.title) === slug) || null;
};

module.exports = {
  LOCAL_BOOK_ALIASES,
  getLocalAliasIdsForTitle,
  expandBookAccessIds,
  resolveBookByIdOrAlias,
  slugifyBookTitle,
  findAliasByKey
};

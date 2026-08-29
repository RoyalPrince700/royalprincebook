import { bookData as leadingFromWithinBook } from '../chapters';
import { buildWithAiBookData } from '../chapters/build-with-ai';

const LOCAL_BOOKS = [leadingFromWithinBook, buildWithAiBookData];

const localBookMap = new Map(LOCAL_BOOKS.map((book) => [book._id, book]));

export const isLocalBookId = (bookId) => localBookMap.has(bookId);

export const getLocalBook = (bookId) => {
  const book = localBookMap.get(bookId);
  if (!book) return null;

  return {
    ...book,
    isLocal: true,
    author: book.author || { username: 'Royal Prince', email: 'admin@royalprincehub.com' },
    pagesCount: Array.isArray(book.pages) ? book.pages.length : 0,
    purchaseCount: 0,
    revenue: 0
  };
};

export const getAllLocalBooks = () =>
  LOCAL_BOOKS.map((book) => getLocalBook(book._id));

export const mergeBooksForCatalog = (apiBooks = []) => {
  const apiIds = new Set(apiBooks.map((book) => book._id));
  const localOnly = getAllLocalBooks().filter((book) => !apiIds.has(book._id));

  return [...localOnly, ...apiBooks];
};

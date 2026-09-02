import { bookData as leadingFromWithinBook } from '../chapters';
import { buildWithAiBookData } from '../chapters/build-with-ai';
import { isBuildWithAi, isLeadershipFromWithin } from './bookUtils';

const LOCAL_BOOKS = [leadingFromWithinBook, buildWithAiBookData];

const localBookMap = new Map(LOCAL_BOOKS.map((book) => [book._id, book]));

const apiBookMatchesLocal = (apiBook, localBook) => {
  if (apiBook?._id && localBook?._id && apiBook._id === localBook._id) {
    return true;
  }

  const title = apiBook?.title || '';
  if (localBook._id === leadingFromWithinBook._id) {
    return isLeadershipFromWithin(title);
  }
  if (localBook._id === buildWithAiBookData._id) {
    return isBuildWithAi(title);
  }

  return false;
};

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
  const localOnly = getAllLocalBooks().filter(
    (localBook) => !apiBooks.some((apiBook) => apiBookMatchesLocal(apiBook, localBook))
  );

  return [...localOnly, ...apiBooks];
};

export const getLocalBookForApiBook = (apiBook) => {
  if (!apiBook) {
    return null;
  }

  return getAllLocalBooks().find((localBook) => apiBookMatchesLocal(apiBook, localBook)) || null;
};

export { apiBookMatchesLocal };

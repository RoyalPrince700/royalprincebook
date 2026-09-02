import { getLocalBookForApiBook, isLocalBookId } from './localBookService';

export const normalizeBookId = (id) => String(id ?? '');

export const userHasBookAccess = (user, book) => {
  if (!book) {
    return false;
  }

  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  if (!book.price || book.price <= 0) {
    return true;
  }

  const bookId = normalizeBookId(book._id);
  const accessIds = (user.purchasedBooks || []).map(normalizeBookId);

  if (accessIds.includes(bookId)) {
    return true;
  }

  const localBook = isLocalBookId(bookId) ? null : getLocalBookForApiBook(book);
  if (localBook && accessIds.includes(normalizeBookId(localBook._id))) {
    return true;
  }

  return false;
};

export const getReadBookId = (book) => {
  if (!book?._id) {
    return '';
  }

  if (isLocalBookId(book._id)) {
    return book._id;
  }

  const localBook = getLocalBookForApiBook(book);
  return localBook?._id || book._id;
};

export const isPremiumUser = (user) => {
  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  return Array.isArray(user.purchasedBooks) && user.purchasedBooks.length > 0;
};

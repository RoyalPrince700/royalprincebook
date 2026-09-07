import { isBuildWithAi, isLeadershipFromWithin } from './bookUtils';
import {
  getAllLocalBooks,
  getLocalBook,
  getLocalBookForApiBook,
  isLocalBookId
} from './localBookService';

export const CATALOG_BOOK_SLUGS = {
  BUILD_WITH_AI: 'build-with-ai',
  LEADING_FROM_WITHIN: 'leading-from-within'
};

const CATALOG_SLUG_ALIASES = {
  'build-with-ai': CATALOG_BOOK_SLUGS.BUILD_WITH_AI,
  'local-build-with-ai': CATALOG_BOOK_SLUGS.BUILD_WITH_AI,
  'leading-from-within': CATALOG_BOOK_SLUGS.LEADING_FROM_WITHIN,
  'leadership-from-within': CATALOG_BOOK_SLUGS.LEADING_FROM_WITHIN,
  'local-leading-from-within': CATALOG_BOOK_SLUGS.LEADING_FROM_WITHIN
};

export const slugifyBookTitle = (title = '') =>
  String(title)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export const normalizeBookSlug = (value = '') => {
  const raw = String(value || '')
    .trim()
    .toLowerCase();

  if (!raw) {
    return '';
  }

  return CATALOG_SLUG_ALIASES[raw] || raw;
};

export const isMongoObjectId = (value = '') =>
  /^[a-f\d]{24}$/i.test(String(value || '').trim());

export const getBookSlug = (book) => {
  if (!book) {
    return '';
  }

  const id = String(book._id || '');
  if (CATALOG_SLUG_ALIASES[id]) {
    return CATALOG_SLUG_ALIASES[id];
  }

  const title = book.title || '';
  if (isBuildWithAi(title)) {
    return CATALOG_BOOK_SLUGS.BUILD_WITH_AI;
  }
  if (isLeadershipFromWithin(title)) {
    return CATALOG_BOOK_SLUGS.LEADING_FROM_WITHIN;
  }

  return slugifyBookTitle(title);
};

export const getBookDetailsPath = (book) => {
  const slug = getBookSlug(book);
  return slug ? `/books/${slug}/details` : '/all-books';
};

export const getBookReadPath = (book) => {
  const slug = getBookSlug(book);
  return slug ? `/books/${slug}/read` : '/all-books';
};

export const getBookEditPath = (book) => {
  if (!book?._id || isLocalBookId(book._id)) {
    return '/all-books';
  }

  return `/books/${book._id}`;
};

export const getLocalBookBySlug = (slug) => {
  const normalized = normalizeBookSlug(slug);
  if (!normalized) {
    return null;
  }

  if (isLocalBookId(normalized)) {
    return getLocalBook(normalized);
  }

  return (
    getAllLocalBooks().find((book) => getBookSlug(book) === normalized) || null
  );
};

export const bookMatchesSlug = (book, slug) => {
  if (!book || !slug) {
    return false;
  }

  const normalized = normalizeBookSlug(slug);
  if (!normalized) {
    return false;
  }

  if (String(book._id) === String(slug) || String(book._id) === normalized) {
    return true;
  }

  return getBookSlug(book) === normalized;
};

/**
 * Resolve a URL book key (slug | ObjectId | local-*) into the book used for reading/details.
 * Prefers local chapter content when the API book maps to a local catalog book.
 */
export const resolveBookFromKey = async (bookKey, fetchDetails) => {
  const key = String(bookKey || '').trim();
  if (!key) {
    return null;
  }

  const mergeLocalWithApi = (localBook, apiBook) => {
    if (!localBook) {
      return apiBook || null;
    }

    if (!apiBook) {
      return localBook;
    }

    return {
      ...localBook,
      apiBookId: apiBook._id,
      price: apiBook.price ?? localBook.price,
      description: apiBook.description || localBook.description
    };
  };

  if (isLocalBookId(key)) {
    const localBook = getLocalBook(key);
    try {
      const apiBook = await fetchDetails(getBookSlug(localBook) || key);
      return mergeLocalWithApi(localBook, apiBook);
    } catch (_error) {
      return localBook;
    }
  }

  const localBySlug = !isMongoObjectId(key) ? getLocalBookBySlug(key) : null;
  if (localBySlug) {
    try {
      const apiBook = await fetchDetails(key);
      return mergeLocalWithApi(localBySlug, apiBook);
    } catch (_error) {
      return localBySlug;
    }
  }

  const apiBook = await fetchDetails(key);
  if (!apiBook) {
    return null;
  }

  return mergeLocalWithApi(getLocalBookForApiBook(apiBook), apiBook);
};

import leadingFromWithinImage from '../assets/leadershipfromwithin.jpg';

const normalizeTitle = (title = '') => title.toLowerCase().replace(/\s+/g, ' ').trim();
const LEADERSHIP_FROM_WITHIN_ORIGINAL_PRICE = 2000;

export const isLeadershipFromWithin = (title) => {
  const normalized = normalizeTitle(title);
  return (
    normalized.includes('leading from within') ||
    normalized.includes('leadership from within') ||
    normalized.includes('leading from withing')
  );
};

export const getBookCover = (title) => {
  if (!title) return 'https://placehold.co/280x420/e9ecef/333333?text=No+Cover';

  // Handle common spelling variation in seeded data/title text.
  if (isLeadershipFromWithin(title)) {
    return leadingFromWithinImage;
  }

  return `https://placehold.co/280x420/e9ecef/333333?text=${encodeURIComponent(title)}`;
};

export const getOriginalBookPrice = (title, currentPrice) => {
  if (!isLeadershipFromWithin(title)) return null;
  if (!currentPrice || currentPrice <= 0) return null;
  return currentPrice < LEADERSHIP_FROM_WITHIN_ORIGINAL_PRICE
    ? LEADERSHIP_FROM_WITHIN_ORIGINAL_PRICE
    : null;
};

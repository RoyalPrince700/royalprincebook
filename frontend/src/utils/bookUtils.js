import leadingFromWithinImage from '../assets/leadershipfromwithin.jpg';

const normalizeTitle = (title = '') => title.toLowerCase().replace(/\s+/g, ' ').trim();

export const getBookCover = (title) => {
  if (!title) return 'https://placehold.co/280x420/e9ecef/333333?text=No+Cover';

  const normalized = normalizeTitle(title);

  // Handle common spelling variation in seeded data/title text.
  if (normalized.includes('leading from within') || normalized.includes('leading from withing')) {
    return leadingFromWithinImage;
  }

  return `https://placehold.co/280x420/e9ecef/333333?text=${encodeURIComponent(title)}`;
};

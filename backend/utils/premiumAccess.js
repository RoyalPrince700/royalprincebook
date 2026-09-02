const User = require('../models/User');

const userHasPremiumAccess = async (user) => {
  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  const freshUser = user.purchasedBooks
    ? user
    : await User.findById(user._id).select('purchasedBooks role');

  if (!freshUser) {
    return false;
  }

  return Array.isArray(freshUser.purchasedBooks) && freshUser.purchasedBooks.length > 0;
};

module.exports = {
  userHasPremiumAccess
};

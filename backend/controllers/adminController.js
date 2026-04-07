const Book = require('../models/Book');
const User = require('../models/User');
const PaymentTransaction = require('../models/PaymentTransaction');
const { applyEffectivePrice } = require('../bookPricing');

const getAdminOverview = async (_req, res) => {
  try {
    const [
      totalBooks,
      totalUsers,
      roleCounts,
      paidUsersCount,
      purchasedBooksAggregate,
      financeAggregate,
      recentTransactions,
      recentBooks
    ] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      User.countDocuments({ 'purchasedBooks.0': { $exists: true } }),
      User.aggregate([
        {
          $project: {
            purchasedBooksCount: {
              $size: { $ifNull: ['$purchasedBooks', []] }
            }
          }
        },
        {
          $group: {
            _id: null,
            booksUnlocked: { $sum: '$purchasedBooksCount' }
          }
        }
      ]),
      PaymentTransaction.aggregate([
        { $match: { status: 'successful' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            totalTransactions: { $sum: 1 }
          }
        }
      ]),
      PaymentTransaction.find({ status: 'successful' })
        .populate('user', 'username email')
        .populate('book', 'title')
        .sort({ paidAt: -1, createdAt: -1 })
        .limit(6),
      Book.find()
        .populate('author', 'username email')
        .sort({ updatedAt: -1 })
        .limit(6)
    ]);

    const roleSummary = roleCounts.reduce((accumulator, item) => {
      accumulator[item._id] = item.count;
      return accumulator;
    }, {});

    const financeSummary = financeAggregate[0] || {
      totalRevenue: 0,
      totalTransactions: 0
    };

    res.json({
      stats: {
        totalBooks,
        totalUsers,
        totalAdmins: roleSummary.admin || 0,
        totalReaders: roleSummary.user || 0,
        paidUsers: paidUsersCount,
        booksUnlocked: purchasedBooksAggregate[0]?.booksUnlocked || 0,
        totalRevenue: financeSummary.totalRevenue || 0,
        totalTransactions: financeSummary.totalTransactions || 0
      },
      recentTransactions,
      recentBooks: recentBooks.map((book) => ({
        ...applyEffectivePrice(book),
        pagesCount: Array.isArray(book.pages) ? book.pages.length : 0
      }))
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminBooks = async (_req, res) => {
  try {
    const [books, transactionStats] = await Promise.all([
      Book.find()
        .populate('author', 'username email')
        .sort({ updatedAt: -1 }),
      PaymentTransaction.aggregate([
        { $match: { status: 'successful' } },
        {
          $group: {
            _id: '$book',
            purchaseCount: { $sum: 1 },
            revenue: { $sum: '$amount' },
            lastPurchaseAt: { $max: '$paidAt' }
          }
        }
      ])
    ]);

    const transactionMap = new Map(
      transactionStats.map((item) => [String(item._id), item])
    );

    res.json({
      books: books.map((book) => {
        const stats = transactionMap.get(String(book._id));

        return {
          ...applyEffectivePrice(book),
          pagesCount: Array.isArray(book.pages) ? book.pages.length : 0,
          purchaseCount: stats?.purchaseCount || 0,
          revenue: stats?.revenue || 0,
          lastPurchaseAt: stats?.lastPurchaseAt || null
        };
      })
    });
  } catch (error) {
    console.error('Admin books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminUsers = async (_req, res) => {
  try {
    const [users, transactionStats] = await Promise.all([
      User.find({}, '-password').sort({ createdAt: -1 }),
      PaymentTransaction.aggregate([
        { $match: { status: 'successful' } },
        {
          $group: {
            _id: '$user',
            paymentCount: { $sum: 1 },
            totalSpent: { $sum: '$amount' },
            lastPaymentAt: { $max: '$paidAt' }
          }
        }
      ])
    ]);

    const transactionMap = new Map(
      transactionStats.map((item) => [String(item._id), item])
    );

    res.json({
      users: users.map((user) => {
        const userStats = transactionMap.get(String(user._id));
        const purchasedBooksCount = Array.isArray(user.purchasedBooks)
          ? user.purchasedBooks.length
          : 0;

        return {
          ...user.toObject(),
          purchasedBooksCount,
          paymentCount: userStats?.paymentCount || 0,
          totalSpent: userStats?.totalSpent || 0,
          lastPaymentAt: userStats?.lastPaymentAt || null,
          hasPaid: purchasedBooksCount > 0 || (userStats?.paymentCount || 0) > 0
        };
      })
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdminFinance = async (_req, res) => {
  try {
    const [financeAggregate, purchasedBooksAggregate, transactions, users, transactionStats] = await Promise.all([
      PaymentTransaction.aggregate([
        { $match: { status: 'successful' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            totalTransactions: { $sum: 1 },
            averageOrderValue: { $avg: '$amount' }
          }
        }
      ]),
      User.aggregate([
        {
          $project: {
            purchasedBooksCount: {
              $size: { $ifNull: ['$purchasedBooks', []] }
            }
          }
        },
        {
          $group: {
            _id: null,
            booksUnlocked: { $sum: '$purchasedBooksCount' },
            paidUsersCount: {
              $sum: {
                $cond: [{ $gt: ['$purchasedBooksCount', 0] }, 1, 0]
              }
            }
          }
        }
      ]),
      PaymentTransaction.find({ status: 'successful' })
        .populate('user', 'username email')
        .populate('book', 'title')
        .sort({ paidAt: -1, createdAt: -1 })
        .limit(50),
      User.find({}, '-password').sort({ createdAt: -1 }),
      PaymentTransaction.aggregate([
        { $match: { status: 'successful' } },
        {
          $group: {
            _id: '$user',
            paymentCount: { $sum: 1 },
            totalSpent: { $sum: '$amount' },
            lastPaymentAt: { $max: '$paidAt' }
          }
        }
      ])
    ]);

    const financeSummary = financeAggregate[0] || {
      totalRevenue: 0,
      totalTransactions: 0,
      averageOrderValue: 0
    };

    const purchaseSummary = purchasedBooksAggregate[0] || {
      booksUnlocked: 0,
      paidUsersCount: 0
    };

    const transactionMap = new Map(
      transactionStats.map((item) => [String(item._id), item])
    );

    const paidUsers = users
      .map((user) => {
        const userStats = transactionMap.get(String(user._id));
        const purchasedBooksCount = Array.isArray(user.purchasedBooks)
          ? user.purchasedBooks.length
          : 0;
        const paymentCount = userStats?.paymentCount || 0;

        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          purchasedBooksCount,
          paymentCount,
          totalSpent: userStats?.totalSpent || 0,
          lastPaymentAt: userStats?.lastPaymentAt || null
        };
      })
      .filter((user) => user.purchasedBooksCount > 0 || user.paymentCount > 0)
      .sort((firstUser, secondUser) => {
        if (secondUser.totalSpent !== firstUser.totalSpent) {
          return secondUser.totalSpent - firstUser.totalSpent;
        }

        return secondUser.purchasedBooksCount - firstUser.purchasedBooksCount;
      });

    res.json({
      stats: {
        totalRevenue: financeSummary.totalRevenue || 0,
        totalTransactions: financeSummary.totalTransactions || 0,
        averageOrderValue: financeSummary.averageOrderValue || 0,
        booksUnlocked: purchaseSummary.booksUnlocked || 0,
        paidUsers: purchaseSummary.paidUsersCount || 0
      },
      transactions,
      paidUsers
    });
  } catch (error) {
    console.error('Admin finance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminOverview,
  getAdminBooks,
  getAdminUsers,
  getAdminFinance
};

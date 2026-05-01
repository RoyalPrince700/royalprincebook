const Book = require('../models/Book');
const User = require('../models/User');
const PaymentTransaction = require('../models/PaymentTransaction');
const AdminGameProgress = require('../models/AdminGameProgress');
const { applyEffectivePrice } = require('../bookPricing');

const gameSegments = ['vocabulary', 'conciseness', 'concisePick', 'connectors', 'fluentFraming', 'speech', 'presentation', 'pronunciation'];

const defaultGameProgress = {
  vocabulary: 0,
  conciseness: 0,
  concisePick: 0,
  connectors: 0,
  fluentFraming: 0,
  speech: 0,
  presentation: 0,
  pronunciation: 0
};

const defaultSegmentScores = {
  vocabulary: 0,
  conciseness: 0,
  concisePick: 0,
  connectors: 0,
  fluentFraming: 0,
  speech: 0,
  presentation: 0,
  pronunciation: 0
};

const clampNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return min;
  return Math.min(max, Math.max(min, numberValue));
};

const getLevelForScore = (score) => {
  if (score >= 420) return 'Royal Orator';
  if (score >= 280) return 'Confident Orator';
  if (score >= 160) return 'Eloquent Presenter';
  if (score >= 70) return 'Clear Communicator';
  return 'Articulate Novice';
};

const normalizeSegmentMap = (incoming = {}, defaults = {}, max = Number.MAX_SAFE_INTEGER) => (
  gameSegments.reduce((normalized, segment) => ({
    ...normalized,
    [segment]: clampNumber(incoming[segment] ?? defaults[segment] ?? 0, 0, max)
  }), {})
);

const normalizeRecentActivity = (activities = []) => (
  activities
    .filter((activity) => gameSegments.includes(activity?.segment) && activity?.title)
    .slice(0, 8)
    .map((activity) => ({
      segment: activity.segment,
      title: String(activity.title).slice(0, 120),
      points: clampNumber(activity.points, 0),
      feedback: activity.feedback ? String(activity.feedback).slice(0, 500) : '',
      createdAt: activity.createdAt || new Date()
    }))
);

const getPurchasedBooksCount = (user) => (
  Array.isArray(user?.purchasedBooks) ? user.purchasedBooks.length : 0
);

const getPaymentCount = (userStats) => userStats?.paymentCount || 0;

const getBooksUnlockedCount = (user, userStats) => (
  Math.max(getPurchasedBooksCount(user), getPaymentCount(userStats))
);

const hasPaidActivity = (user, userStats) => getBooksUnlockedCount(user, userStats) > 0;

const getAdminOverview = async (_req, res) => {
  try {
    const [
      totalBooks,
      totalUsers,
      roleCounts,
      purchaseUsers,
      transactionStats,
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
      User.find({}, 'purchasedBooks').lean(),
      PaymentTransaction.aggregate([
        { $match: { status: 'successful' } },
        {
          $group: {
            _id: '$user',
            paymentCount: { $sum: 1 }
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

    const transactionMap = new Map(
      transactionStats.map((item) => [String(item._id), item])
    );

    const purchaseSummary = purchaseUsers.reduce((summary, user) => {
      const userStats = transactionMap.get(String(user._id));
      const booksUnlockedCount = getBooksUnlockedCount(user, userStats);

      return {
        paidUsers: summary.paidUsers + (hasPaidActivity(user, userStats) ? 1 : 0),
        booksUnlocked: summary.booksUnlocked + booksUnlockedCount
      };
    }, {
      paidUsers: 0,
      booksUnlocked: 0
    });

    res.json({
      stats: {
        totalBooks,
        totalUsers,
        totalAdmins: roleSummary.admin || 0,
        totalReaders: roleSummary.user || 0,
        paidUsers: purchaseSummary.paidUsers,
        booksUnlocked: purchaseSummary.booksUnlocked,
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
        const purchasedBooksCount = getPurchasedBooksCount(user);
        const paymentCount = getPaymentCount(userStats);
        const booksUnlockedCount = getBooksUnlockedCount(user, userStats);

        return {
          ...user.toObject(),
          purchasedBooksCount,
          paymentCount,
          booksUnlockedCount,
          totalSpent: userStats?.totalSpent || 0,
          lastPaymentAt: userStats?.lastPaymentAt || null,
          hasPaid: hasPaidActivity(user, userStats)
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
    const [financeAggregate, transactions, users, transactionStats] = await Promise.all([
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

    const transactionMap = new Map(
      transactionStats.map((item) => [String(item._id), item])
    );

    const paidUsers = users
      .map((user) => {
        const userStats = transactionMap.get(String(user._id));
        const purchasedBooksCount = getPurchasedBooksCount(user);
        const paymentCount = getPaymentCount(userStats);
        const booksUnlockedCount = getBooksUnlockedCount(user, userStats);

        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          purchasedBooksCount,
          booksUnlockedCount,
          paymentCount,
          totalSpent: userStats?.totalSpent || 0,
          lastPaymentAt: userStats?.lastPaymentAt || null
        };
      })
      .filter((user) => user.booksUnlockedCount > 0 || user.paymentCount > 0)
      .sort((firstUser, secondUser) => {
        if (secondUser.totalSpent !== firstUser.totalSpent) {
          return secondUser.totalSpent - firstUser.totalSpent;
        }

        return secondUser.booksUnlockedCount - firstUser.booksUnlockedCount;
      });

    const purchaseSummary = paidUsers.reduce((summary, user) => ({
      booksUnlocked: summary.booksUnlocked + (user.booksUnlockedCount || 0),
      paidUsersCount: summary.paidUsersCount + 1
    }), {
      booksUnlocked: 0,
      paidUsersCount: 0
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

const serializeGameProgress = (progressDocument) => ({
  progress: {
    ...defaultGameProgress,
    ...(progressDocument.progress?.toObject?.() || progressDocument.progress || {})
  },
  segmentScores: {
    ...defaultSegmentScores,
    ...(progressDocument.segmentScores?.toObject?.() || progressDocument.segmentScores || {})
  },
  score: progressDocument.score || 0,
  streak: progressDocument.streak || 0,
  level: progressDocument.level || 'Articulate Novice',
  completedSessions: progressDocument.completedSessions || 0,
  achievements: progressDocument.achievements || [],
  recentActivity: progressDocument.recentActivity || [],
  lastPlayed: progressDocument.lastPlayed || null
});

const getAdminGameProgress = async (req, res) => {
  try {
    const progressDocument = await AdminGameProgress.findOneAndUpdate(
      { user: req.user._id },
      {
        $setOnInsert: {
          user: req.user._id,
          progress: defaultGameProgress,
          segmentScores: defaultSegmentScores,
          level: 'Articulate Novice'
        }
      },
      { new: true, upsert: true }
    );

    res.json(serializeGameProgress(progressDocument));
  } catch (error) {
    console.error('Admin game progress fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAdminGameProgress = async (req, res) => {
  try {
    const currentProgress = await AdminGameProgress.findOne({ user: req.user._id });
    const body = req.body || {};
    const score = clampNumber(body.score, 0);

    const progressDocument = await AdminGameProgress.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        progress: normalizeSegmentMap(body.progress, currentProgress?.progress || defaultGameProgress, 100),
        segmentScores: normalizeSegmentMap(body.segmentScores, currentProgress?.segmentScores || defaultSegmentScores),
        score,
        streak: clampNumber(body.streak, 0),
        level: getLevelForScore(score),
        completedSessions: clampNumber(body.completedSessions, 0),
        achievements: Array.isArray(body.achievements)
          ? body.achievements.slice(0, 12).map((achievement) => String(achievement).slice(0, 80))
          : [],
        recentActivity: normalizeRecentActivity(body.recentActivity),
        lastPlayed: new Date()
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(serializeGameProgress(progressDocument));
  } catch (error) {
    console.error('Admin game progress update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminOverview,
  getAdminBooks,
  getAdminUsers,
  getAdminFinance,
  getAdminGameProgress,
  updateAdminGameProgress
};

const Company = require('../../models/company/Company');
const IPOTransaction = require('../../models/company/Transaction');
const Account = require('../../models/account/Account');
const User = require('../../models/users/User');
const Transaction = require('../../models/account/Transaction');
const IPOIncome = require('../../models/company/Income');
const { STATUS, MESSAGES } = require('../../constants/overview');
const ErrorHandler = require('../../utils/errorHandler');

// Helper function to safely execute aggregation
const safeAggregation = async (model, pipeline) => {
  try {
    const result = await model.aggregate(pipeline);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Aggregation failed for ${model.modelName}:`, error);
    return null;
  }
};

// Helper function to get total amount
const getTotalAmount = async (model, field = 'amount') => {
  const pipeline = [
    {
      $group: {
        _id: null,
        total: { $sum: `$${field}` }
      }
    }
  ];
  const result = await safeAggregation(model, pipeline);
  return result?.total || 0;
};

exports.getDashboardStatistics = async (req, res, next) => {
  try {
    // Execute all queries concurrently for better performance
    const [
      companyStats,
      ipoTransactionTotal,
      ipoIncomeTotal,
      userStats,
      transactionTotal,
      companyData,
      bankBalance
    ] = await Promise.all([
      // Company statistics
      Company.aggregate([
        {
          $group: {
            _id: null,
            mainCount: {
              $sum: { $cond: [{ $eq: ['$isMain', true] }, 1, 0] }
            },
            smeCount: {
              $sum: { $cond: [{ $eq: ['$isMain', false] }, 1, 0] }
            }
          }
        }
      ]),

      // IPO Transaction total
      getTotalAmount(IPOTransaction),

      // IPO Income total
      getTotalAmount(IPOIncome, 'finalAmount'),

      // User statistics
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            dematUsers: {
              $sum: { $cond: [{ $eq: ['$hasDematAccount', true] }, 1, 0] }
            }
          }
        }
      ]),

      // Transaction total
      getTotalAmount(Transaction),

      // Company data
      Company.find({}, { isMain: 1, endDate: 1 }).lean(),

      // Bank balance
      Account.aggregate([
        {
          $group: {
            _id: null,
            creditBalance: {
              $sum: {
                $cond: [
                  { $gte: ['$balance', 0] },
                  '$balance',
                  0
                ]
              }
            },
            debitBalance: {
              $sum: {
                $cond: [
                  { $lt: ['$balance', 0] },
                  { $abs: '$balance' },
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    // Extract values with safe fallbacks
    const { mainCount = 0, smeCount = 0 } = companyStats[0] || {};
    const { totalUsers = 0, dematUsers = 0 } = userStats[0] || {};
    const { creditBalance = 0, debitBalance = 0 } = bankBalance[0] || {};

    const statistics = {
      amount: ipoTransactionTotal,
      mainCompany: mainCount,
      smeCompany: smeCount,
      dematuser: dematUsers,
      companyData,
      incomeAmount: ipoIncomeTotal,
      transactionAmount: transactionTotal,
      creditBalance,
      debitBalance,
      user: totalUsers,
    };

    res.status(STATUS.OK).json(statistics);
  } catch (error) {
    console.error('Dashboard statistics error:', error);
    next(new ErrorHandler(MESSAGES.STATISTICS_ERR_FETCH, STATUS.SERVER_ERROR));
  }
};
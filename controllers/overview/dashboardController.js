const Company = require('../../models/company/Company');
const IPOTransaction = require('../../models/company/Transaction');
const Account = require('../../models/account/Account');
const User = require('../../models/users/User');
const Transaction = require('../../models/account/Transaction');
const { STATUS, MESSAGES } = require('../../constants/overview');
const ErrorHandler = require('../../utils/errorHandler');

// Get company statistics
exports.getDashboardStatistics = async (req, res,next) => {
  try {
    // Aggregate to get main and sme company counts
    const companyCountStats = await Company.aggregate([
      {
        $group: {
          _id: '$isMain',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          isMain: '$_id',
          count: 1,
        },
      },
    ]);

    const mainCompanyCount = companyCountStats.find(stat => stat.isMain === true)?.count || 0;
    const smeCompanyCount = companyCountStats.find(stat => stat.isMain === false)?.count || 0;

    // Aggregate to get total amount
    const totalAmountResult = await IPOTransaction.aggregate([
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' },
        },
      },
    ]);

    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].amount : 0;

    // Aggregate to get user count
    const dematuserCount= await User.countDocuments({ hasDematAccount: true });
   
    const userCount = await User.countDocuments();
    const transactionAmount = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' },
        },
      },
    ]);

    const companyData = await Company.find({}, { isMain: 1, endDate: 1 })

    // Aggregate to get total credit and debit amounts
    const bankBalance = await Account.aggregate(
      [
        {
          $group: {
            _id: null,
            creditBalance: {
              $sum: {
                $cond: [
                  { $gte: ["$balance", 0] },
                  "$balance",
                  0
                ]
              }
            },
            debitBalance: {
              $sum: {
                $cond: [
                  { $lt: ["$balance", 0] },
                  { $abs: "$balance" },
                  0
                ]
              }
            }
          }
        }
      ]
    )

    let [{ creditBalance, debitBalance }] = bankBalance;
    const statistics = {
      amount: totalAmount,
      mainCompany: mainCompanyCount,
      smeCompany: smeCompanyCount,
      dematuser :   dematuserCount,
      companyData: companyData,
      
      transactionAmount: transactionAmount[0].amount,
      creditBalance: creditBalance,
      debitBalance: debitBalance,
      user: userCount,
    };

    res.status(STATUS.OK).json(statistics);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.STATISTICS_ERR_FETCH, STATUS.SERVER_ERROR));
  }
};
// controllers/companyController.js
const Company = require('../models/Company');
const Customer = require('../models/Customer');
const User = require('../models/User');
const UserTransaction = require('../models/UserTransaction');

// Get company statistics
exports.getCompanyStatistics = async (req, res) => {
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
    const totalAmountResult = await Company.aggregate([
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' },
        },
      },
    ]);

    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].amount : 0;

    // Aggregate to get user count
    const userCount = await User.countDocuments();
    const transactionCount = await UserTransaction.countDocuments();

    const companyData=await Company.find({}, { isMain: 1, endDate: 1 })
    // Aggregate to get total credit and debit amounts

    const bankBalance = await Customer.aggregate(
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


    res.status(200).json({
      mainCompany: mainCompanyCount,
      smeCompany: smeCompanyCount,
      amount: totalAmount,
      user: userCount,
      creditBalance: creditBalance,
      debitBalance: debitBalance,
      companyData:companyData
    });
  } catch (err) {

    res.status(500).json({ error: 'Internal server error', err });
  }
};



// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// const companyCountStatsd = await Company.aggregate([
//   {
//     $addFields: {
//       month: { $month: "$endDate" }
//     }
//   },
//   {
//     $group: {
//       _id: {
//         month: "$month",
//         isMain: "$isMain"
//       },
//       count: { $sum: 1 }
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       month: "$_id.month",
//       isMain: "$_id.isMain",
//       count: 1
//     }
//   },
//   {
//     $sort: {
//       month: 1
//     }
//   }
// ]);

// const mainSeries = new Array(12).fill(0);
// const nonMainSeries = new Array(12).fill(0);
// const mySeries = new Array(12).fill(0);

// companyCountStatsd.forEach(stat => {
//   const monthIndex = stat.month - 1;
//   if (stat.isMain) {
//     mainSeries[monthIndex] = stat.count;
//   } else {
//     nonMainSeries[monthIndex] = stat.count;
//   }
//   mySeries[monthIndex] = mainSeries[monthIndex] + nonMainSeries[monthIndex];
// });


// const chartData = {
//   labels: months,
//   mainSeries,
//   nonMainSeries,
//   mySeries
// };
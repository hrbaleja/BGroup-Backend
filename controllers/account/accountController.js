const Account = require("../../models/account/Account");
const Transaction = require("../../models/account/Transaction");
const User = require("../../models/users/User");
const { STATUS, MESSAGES } = require("../../constants/bank");
const ErrorHandler = require("../../utils/errorHandler");
const nodemailers = require('nodemailer');
const { sendEmail } = require("../../services/mailService");

// Create a new account
exports.createAccount = async (req, res, next) => {
  try {
    const createdBy = req.user.Id;
    const user = req.body.user;
    const account = new Account({
      user,
      createdBy,
      updatedBy: createdBy,
    });
    await account.save();
    res.status(STATUS.CREATED).json({ message: MESSAGES.ACCOUNT_CREATED });
  } catch (err) {
    next(new ErrorHandler(MESSAGES.ACCOUNT_ERR, STATUS.SERVER_ERROR));
  }
};

// Get all accounts
exports.getAccountAll = async (req, res, next) => {
  try {
    const formattedAccounts = await Account.find().populate({
      path: "user",
      select: "name",
    });

    const accounts = formattedAccounts.map((account) => ({
      name: account.user.name,
      updatedAt: account.updatedAt,
      balance: account.balance,
      _id: account._id,
    }));
    res.status(STATUS.OK).json({ message: MESSAGES.ACCOUNT_FETCHED, data: accounts });

    // res.status(STATUS.OK).json(accounts);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.ACCOUNT_ERRFET, STATUS.SERVER_ERROR));
  }
};

// Get users who do not have an account
exports.getUsersWithoutAccount = async (req, res, next) => {
  try {
    const accountIds = await Account.distinct("user");
    const users = await User.find({ _id: { $nin: accountIds } })
      .select("name _id")
      .lean();
    res.status(STATUS.OK).json(users);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.ACCOUNT_ERRFET, STATUS.SERVER_ERROR));
  }
};

exports.getAccounts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "updatedAt",
      sortOrder = "desc",
      name,
      balanceType,
      amountRange,
    } = req.query;

    let aggregationPipeline = [];

    // Scenario 1: Name search
    if (name && name.trim() !== '') {
      aggregationPipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $match: { 'user.name': new RegExp(name.trim(), 'i') } }
      ];
    }
    // Scenario 2: Other filters
    else {
      const matchStage = {};

      if (balanceType) {
        switch (balanceType) {
          case "Credit":
            matchStage.balance = { $gt: 0 };
            break;
          case "Debit":
            matchStage.balance = { $lt: 0 };
            break;
          case "Zero":
            matchStage.balance = 0;
            break;
        }
      }

      // Amount range filter
      if (amountRange) {
        switch (amountRange) {
          case "below":
            if (balanceType === "Credit") {
              matchStage.balance = { ...(matchStage.balance || {}), $lt: 1000 };
            } else if (balanceType === "Debit") {
              matchStage.balance = { ...(matchStage.balance || {}), $gt: -1000 };
            } else if (!balanceType) {
              matchStage.balance = { $lt: 1000, $gte: 0 };
            }
            break;
          case "between":
            if (balanceType === "Credit") {
              matchStage.balance = { ...(matchStage.balance || {}), $gte: 1000, $lte: 5000 };
            } else if (balanceType === "Debit") {
              matchStage.balance = { ...(matchStage.balance || {}), $gte: -5000, $lte: -1000 };
            } else if (!balanceType) {
              matchStage.balance = { $gte: 1000, $lte: 5000, };
            }
            break;
          case "above":
            if (balanceType === "Credit") {
              matchStage.balance = { ...(matchStage.balance || {}), $gt: 5000 };
            } else if (balanceType === "Debit") {
              matchStage.balance = { ...(matchStage.balance || {}), $lt: -5000 };
            } else if (!balanceType) {
              matchStage.balance = { $gt: 5000, };
            }
            break;
        }
      }
      aggregationPipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $match: matchStage }
      ];
    }

    aggregationPipeline = [
      ...aggregationPipeline,
      {
        $facet: {
          paginatedResults: [
            { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) },
            {
              $project: {
                _id: 1,
                balance: 1,
                'user._id': 1,
                'user.name': 1,
                createdAt: 1,
                updatedAt: 1
              }
            }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ];

    const [result] = await Account.aggregate(aggregationPipeline);
    const formattedAccounts = result.paginatedResults;
    const totalDocs = result.totalCount[0] ? result.totalCount[0].count : 0;

    res.status(200).json({
      accounts: formattedAccounts,
      message: MESSAGES.ACCOUNT_FETCHED,
      pagination: {
        totalDocs,
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(totalDocs / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error in getAccounts:', error);
    res.status(500).json({ message: 'An error occurred while fetching accounts', error: error.message });
  }
};

// Function to delete account and associated transactions
exports.deleteAccountAndTransactions = async (req, res) => {
  const { accountId } = req.params;

  try {
    const transactions = await Transaction.deleteMany({ customer: accountId });

    const account = await Account.findOneAndDelete({ _id: accountId });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.status(200).json({
      message: `Account and all transactions for account ID ${accountId} have been deleted.`,
      deletedTransactions: transactions.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting account and transactions:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the account and transactions.' });
  }
};

// Method to send email with transaction details
exports.sendTransactionEmail = async (req, res, next) => {
  const { to, subject, html } = req.body;
  try {
    // Call the sendEmail function from the service
    const emailResult = await sendEmail(to, subject, html);

    if (emailResult.success) {
      res.status(200).json({ success: true, message: emailResult.message });
    } else {
      res.status(500).json({ success: false, message: emailResult.message, error: emailResult.error });
    }
  } catch (err) {
    console.error('Error in sending email:', err);
    res.status(500).json({ success: false, message: 'Failed to send email', error: err.message });
  }
};
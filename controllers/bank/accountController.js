const Account = require("../../models/bank/Account");
const User = require("../../models/users/User");
const { STATUS, MESSAGES } = require("../../constants/bank");
const ErrorHandler = require("../../utils/errorHandler");

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
exports.getAccounts = async (req, res, next) => {
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
    res.status(STATUS.OK).json(accounts);
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

    // Build the query
    let query = {};
    if (name) {
      query["user.name"] = { $regex: name, $options: "i" };
    }

    if (balanceType) {
      switch (balanceType) {
        case "Credit":
          query.balance = { $gt: 0 };
          break;
        case "Debit":
          query.balance = { $lt: 0 };
          break;
        case "Zero":
          query.balance = 0;
          break;
      }
    }

    if (amountRange) {
      switch (amountRange) {
        case "below":
          query.balance = { $lt: 1000, $gt: -1000 };
          break;
        case "between":
          query.balance = { $gte: 1000, $lte: 5000, $lt: -1000, $gt: -5000 };
          break;
        case "above":
          query.balance = { $gt: 5000, $lt: -5000 };
          break;
      }
    }

    // Count total documents for pagination
    const totalDocs = await Account.countDocuments(query);

    // Fetch accounts with pagination and sorting
    const formattedAccounts = await Account.find(query)
      .populate({
        path: "user",
        select: "name",
      })
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const accounts = formattedAccounts.map((account) => ({
      name: account.user.name,
      updatedAt: account.updatedAt,
      balance: account.balance,
      _id: account._id,
    }));

    res.status(STATUS.OK).json({
      accounts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalDocs / limit),
        totalDocs,
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(new ErrorHandler(MESSAGES.ACCOUNT_ERRFET, STATUS.SERVER_ERROR));
  }
};

// Get users who do not have an account
exports.getUsersWithoutAccount = async (req, res, next) => {
  try {
    const accountIds = await Account.distinct("user");
    const users = await User.find({ _id: { $nin: accountIds } });
    res.status(STATUS.OK).json(users);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.ACCOUNT_ERRFET, STATUS.SERVER_ERROR));
  }
};

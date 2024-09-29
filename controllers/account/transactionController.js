const Account = require("../../models/account/Account");
const Transaction = require("../../models/account/Transaction");
const { STATUS, MESSAGES, TRANSACTION_TYPES } = require("../../constants/bank");
const ErrorHandler = require("../../utils/errorHandler");

exports.deposit = async (req, res, next) => {
  try {
    const { customerId, amount, description } = req.body;
    const customer = await Account.findById(customerId);
    if (!customer) {
      return res
        .status(STATUS.NOTFOUND)
        .json({ message: MESSAGES.ACCOUNT_NOTFOUND });
    }

    const transaction = await Transaction.create({
      customer: customerId,
      type: TRANSACTION_TYPES.DEPOSIT,
      amount,
      description,
    });

    const amountd = parseFloat(amount);
    const oldBalance = parseFloat(customer.balance);
    const newBalance = oldBalance + amountd;
    customer.balance = newBalance;
    customer.updatedAt = Date.now();
    customer.updatedBy = req.user.Id;
    await customer.save();
    res.status(STATUS.CREATED).json(MESSAGES.TRANSACTION_SAVE);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.TRANSACTION_ERR, STATUS.SERVER_ERROR));
  }
};

exports.withdraw = async (req, res, next) => {
  try {
    const { customerId, amount, description } = req.body;
    const customer = await Account.findById(customerId);
    if (!customer) {
      return res
        .status(STATUS.NOTFOUND)
        .json({ message: MESSAGES.ACCOUNT_NOTFOUND });
    }

    // if (customer.balance < amount) {
    //      return res.status(STATUS.NOTFOUND).json({ message: MESSAGES.INSUFFICIENT_BALANCE })
    // }

    const transaction = await Transaction.create({
      customer: customerId,
      type: TRANSACTION_TYPES.WITHDRAWAL,
      amount,
      description,
    });

    customer.balance -= amount;
    customer.updatedAt = Date.now();
    customer.updatedBy = req.user.Id;
    await customer.save();
    res.status(STATUS.CREATED).json(MESSAGES.TRANSACTION_SAVE);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.TRANSACTION_ERR, STATUS.SERVER_ERROR));
  }
};

exports.getTransactionsddd = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.ACCOUNT_REQUIRED });
    }

    const customer = await Account.findById(customerId);
    if (!customer) {
      return res
        .status(STATUS.NOTFOUND)
        .json({ message: MESSAGES.ACCOUNT_NOTFOUND });
    }

    const transactions = await Transaction.find({ customer: customerId }).sort({
      createdAt: 1,
    });
    let balance = 0;
    const formattedTransactions = [];
    for (const transaction of transactions) {
      if (transaction.type === "withdrawal") {
        balance -= transaction.amount;
        formattedTransactions.push({
          txnDate: transaction.createdAt,
          description: transaction.description,
          txnId: transaction._id,
          debit: transaction.amount,
          credit: null,
          balance,
        });
      } else if (transaction.type === "deposit") {
        balance += transaction.amount;
        formattedTransactions.push({
          txnDate: transaction.createdAt,
          description: transaction.description,
          txnId: transaction._id,
          debit: null,
          credit: transaction.amount,
          balance,
        });
      }
    }

    const reversedTransactions = formattedTransactions.reverse();
    res.json(reversedTransactions);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.TRANSACTION_ERRGET, STATUS.SERVER_ERROR));
  }
};

exports.getTransactionsd = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.ACCOUNT_REQUIRED });
    }
    const customer = await Account.findById(customerId);
    if (!customer) {
      return res
        .status(STATUS.NOTFOUND)
        .json({ message: MESSAGES.ACCOUNT_NOTFOUND });
    }
    const transactions = await Transaction.find({ customer: customerId }).sort({ createdAt: 1 });
    let balance = 0;
    const formattedTransactions = [];
    for (const transaction of transactions) {
      if (transaction.type === "withdrawal") {
        balance -= transaction.amount;
        formattedTransactions.push({
          txnDate: transaction.createdAt,
          description: transaction.description,
          txnId: transaction._id,
          debit: transaction.amount,
          credit: null,
          balance,
        });
      } else if (transaction.type === "deposit") {
        balance += transaction.amount;
        formattedTransactions.push({
          txnDate: transaction.createdAt,
          description: transaction.description,
          txnId: transaction._id,
          debit: null,
          credit: transaction.amount,
          balance,
        });
      }
    }
    const reversedTransactions = formattedTransactions.reverse();
    res.json(reversedTransactions);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.TRANSACTION_ERRGET, STATUS.SERVER_ERROR));
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      startDate,
      endDate,
      type,
    } = req.query;

    if (!customerId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.ACCOUNT_REQUIRED });
    }

    const customer = await Account.findById(customerId);
    if (!customer) {
      return res
        .status(STATUS.NOTFOUND)
        .json({ message: MESSAGES.ACCOUNT_NOTFOUND });
    }

    let query = { customer: customerId };
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (type) {
      query.type = type;
    }

    // Count total documents for pagination
    const totalDocs = await Transaction.countDocuments(query);

    // Fetch transactions with pagination and sorting
    const transactions = await Transaction.find(query)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    let balance = 0;
    const formattedTransactions = [];

    for (const transaction of transactions) {
      if (transaction.type === "withdrawal") {
        balance -= transaction.amount;
        formattedTransactions.push({
          txnDate: transaction.createdAt,
          description: transaction.description,
          txnId: transaction._id,
          debit: transaction.amount,
          credit: null,
          balance,
        });
      } else if (transaction.type === "deposit") {
        balance += transaction.amount;
        formattedTransactions.push({
          txnDate: transaction.createdAt,
          description: transaction.description,
          txnId: transaction._id,
          debit: null,
          credit: transaction.amount,
          balance,
        });
      }
    }

    res.json({
      transactions: formattedTransactions,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalDocs / limit),
        totalDocs,
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(new ErrorHandler(MESSAGES.TRANSACTION_ERRGET, STATUS.SERVER_ERROR));
  }
};
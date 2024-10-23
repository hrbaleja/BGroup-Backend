const Account = require("../../models/account/Account");
const Transaction = require("../../models/account/Transaction");
const { STATUS, MESSAGES, } = require("../../constants/bank");
const ErrorHandler = require("../../utils/errorHandler");
const jwt = require('jsonwebtoken');

exports.getTransactions = async (req, res, next) => {
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

exports.getTransactionsd = async (req, res, next) => {
  try {
    const { customerId } = req.body;
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
    const payload = { customerId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY });
    res.json(token);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.TRANSACTION_ERRGET, STATUS.SERVER_ERROR));
  }
};
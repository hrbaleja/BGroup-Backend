const Account = require('@models/bank/Account');
const User = require('@models/users/User');
const { STATUS, MESSAGES, } = require('../../constants/bank');
const ErrorHandler = require('../../utils/errorHandler');


// Create a new account 
exports.createAccount = async (req, res, next) => {
  try {
    const createdBy = req.user.Id;
    const user = req.body.user
    const account = new Account({
      user,
      createdBy,
      updatedBy: createdBy
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
    const formattedAccounts = await Account.find()
      .populate({
        path: 'user',
        select: 'name'
      });

    const accounts = formattedAccounts.map(account => ({
      name: account.user.name,
      updatedAt: account.updatedAt,
      balance: account.balance,
      _id: account._id
    }));
    res.status(STATUS.OK).json(accounts);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.ACCOUNT_ERRFET, STATUS.SERVER_ERROR));
  }
};

// Get users who do not have an account
exports.getUsersWithoutAccount = async (req, res, next) => {
  try {
    const accountIds = await Account.distinct('user');
    const users = await User.find({ _id: { $nin: accountIds } });
    res.status(STATUS.OK).json(users);
  } catch (err) {
    next(new ErrorHandler(MESSAGES.ACCOUNT_ERRFET, STATUS.SERVER_ERROR));
  }
};
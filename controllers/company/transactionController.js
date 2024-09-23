const Transaction = require('../../models/company/Transaction');
const Company = require('../../models/company/Company');
const User = require('../../models/users/User');
const { STATUS, MESSAGES } = require('../../constants/company');
const ErrorHandler = require('../../utils/errorHandler');

exports.createTransaction = async (req, res, next) => {
    try {
        const { user, company, lotSize, appliedDate, grantedBy, is_own, is_alloted, remarks, applicationNo } = req.body;

        const companyDoc = await Company.findById(company);
        if (!companyDoc) {
            return next(new ErrorHandler(MESSAGES.COMPANY_NOTFOUND, STATUS.NOT_FOUND));
        }

        const userData = await User.findById(user);
        if (!userData) {
            return next(new ErrorHandler(MESSAGES.USER_NOTFOUND, STATUS.NOT_FOUND));
        }

        const existingTransaction = await Transaction.findOne({ user, company });
        if (existingTransaction) {
            return next(new ErrorHandler(MESSAGES.TRANSACTION_EXISTS, STATUS.BAD_REQUEST));
        }

        const amount = lotSize * companyDoc.amount ;

        const transaction = new Transaction({
            user, company, lotSize, appliedDate, grantedBy, amount, is_own, remarks, applicationNo, is_alloted,
            createdBy: req.user.Id, updatedBy: req.user.Id
        });

        await transaction.save();
        res.status(STATUS.CREATED).json({ message: MESSAGES.TRANSACTION_CREATED});
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TRANSACTION_ERR_CREATE, STATUS.SERVER_ERROR));
    }
};

exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find()
            .populate('user', 'name ')
            .populate('company', 'name ')
            .populate('grantedBy', 'name ');
        res.status(STATUS.OK).json(transactions);
    } catch (err) {
        console.log(err)
        next(new ErrorHandler(MESSAGES.TRANSACTION_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.getTransactionById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const transactions = await Transaction.findById(id);
        if (!transactions) {
            return next(new ErrorHandler(MESSAGES.TRANSACTION_ERR_FETCH, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json(transactions);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TRANSACTION_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.getTransactionBycompny = async (req, res, next) => {
    const { id } = req.params;
    
    if (!id) {
        return next(new ErrorHandler(MESSAGES.COMPANY_ID_REQUIRED, STATUS.BAD_REQUEST));
    }

    try {
        const company = await Company.findById(id);
        if (!company) {
            return next(new ErrorHandler(MESSAGES.COMPANY_NOTFOUND, STATUS.NOT_FOUND));
        }

        const transactions = await Transaction.find({ company: id }).sort({ createdAt: -1 })
            .populate('user', 'name ')
            .populate('grantedBy', 'name ');
        res.status(STATUS.OK).json(transactions);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TRANSACTION_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};


exports.updateTransaction = async (req, res, next) => {
    console.log(req.params.id)
    try {
        const { lotSize, appliedDate, grantedBy, is_own, is_alloted, remarks, applicationNo } = req.body;

        const transaction = await Transaction.findById(req.body._id);
        if (!transaction) {
            return next(new ErrorHandler(MESSAGES.TRANSACTION_NOTFOUND, STATUS.NOT_FOUND));
        }

        const companyDoc = await Company.findById(transaction.company);
        if (!companyDoc) {
            return next(new ErrorHandler(MESSAGES.COMPANY_NOTFOUND, STATUS.NOT_FOUND));
        }

        transaction.lotSize = lotSize || transaction.lotSize;
        transaction.appliedDate = appliedDate || transaction.appliedDate;
        transaction.grantedBy = grantedBy || transaction.grantedBy;
        transaction.is_own = is_own !== undefined ? is_own : transaction.is_own;
        transaction.is_alloted = is_alloted !== undefined ? is_alloted : transaction.is_alloted;
        transaction.amount = lotSize ? lotSize * companyDoc.amount : transaction.amount;
        transaction.remarks = remarks || transaction.remarks;
        transaction.applicationNo = applicationNo || transaction.applicationNo;
        transaction.updatedBy = req.user.Id;
        transaction.updatedAt = Date.now();

        await transaction.save();
        res.status(STATUS.OK).json({ message: MESSAGES.TRANSACTION_UPDATED});
    } catch (err) {
        console.log(err)
        next(new ErrorHandler(MESSAGES.TRANSACTION_ERR_UPDATE, STATUS.SERVER_ERROR));
    }
};

exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return next(new ErrorHandler(MESSAGES.TRANSACTION_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json({ message: MESSAGES.TRANSACTION_DELETED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TRANSACTION_ERR_DELETE, STATUS.SERVER_ERROR));
    }
};
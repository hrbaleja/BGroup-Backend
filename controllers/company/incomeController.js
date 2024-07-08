const Income = require('../../models/company/Income');
const ErrorHandler = require('../../utils/errorHandler');
const Transaction = require('../../models/company/Transaction');
const { STATUS, MESSAGES } = require('../../constants/company');


exports.createIncome = async (req, res, next) => {
    try {
        const { transactionId } = req.body;
        const transactionExist = await Transaction.findById(transactionId);
        if (!transactionExist) {
            return next(new ErrorHandler(MESSAGES.TRANSACTION_NOTFOUND, STATUS.NOT_FOUND));
        }

        const incomeData = new Income(req.body);
        await incomeData.save();
        res.status(STATUS.CREATED).json({ message: MESSAGES.INCOME_CREATED });
    } catch (error) {
        next(new ErrorHandler(MESSAGES.INCOME_ERR_CREATE, STATUS.BAD_REQUEST));
    }
};

exports.getIncomes = async (req, res, next) => {
    try {
        const incomes = await Income.find();
        res.status(STATUS.OK).json(incomes);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.INCOME_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.getIncomeSummary = async (req, res, next) => {
    try {
        const incomeSummary = await Income.aggregate([
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    totalProfit: { $sum: '$profit' },
                    totalSharedProfit: { $sum: '$sharedProfit' },
                    averageProfit: { $avg: '$profit' },
                    maxProfit: { $max: '$profit' },
                    minProfit: { $min: '$profit' },
                },
            },
        ]);

        if (incomeSummary.length === 0) {
            return next(new ErrorHandler(MESSAGES.NO_INCOME_DATA, STATUS.NOT_FOUND));
        }

        res.status(STATUS.OK).json(incomeSummary[0]);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.INCOME_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.getIncomesByUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const incomes = await Income.find({ 'transactionId.user': userId }).populate('transactionId');
        res.status(STATUS.OK).json(incomes);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.INCOME_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.getIncomesByCompany = async (req, res, next) => {
    const { companyId } = req.params;
    try {
        const incomes = await Income.find({ 'transactionId.company': companyId }).populate('transactionId');
        res.status(STATUS.OK).json(incomes);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.INCOME_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.getIncomeById = async (req, res, next) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) {
            return next(new ErrorHandler(MESSAGES.INCOME_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json(income);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.INCOME_ERR_FETCH, STATUS.BAD_REQUEST));
    }
};

exports.updateIncome = async (req, res, next) => {
    try {
        const updatedIncome = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedIncome) {
            return next(new ErrorHandler(MESSAGES.INCOME_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json({ message: MESSAGES.INCOME_UPDATED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.INCOME_ERR_UPDATE, STATUS.BAD_REQUEST));
    }
};

exports.deleteIncome = async (req, res, next) => {
    try {
        const deletedIncome = await Income.findByIdAndDelete(req.params.id);
        if (!deletedIncome) {
            return next(new ErrorHandler(MESSAGES.INCOME_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json({ message: MESSAGES.INCOME_DELETED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.INCOME_ERR_DELETE, STATUS.BAD_REQUEST));
    }
};

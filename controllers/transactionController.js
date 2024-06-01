const Transaction = require('../models/Transaction');
const Company = require('../models/Company');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

exports.createTransaction = async (req, res, next) => {
    try {
        const { user, company, lotSize, appliedDate, grantedBy, is_own, is_alloted, remarks, applicationNo } = req.body;

        // Check if the company exists
        const companyDoc = await Company.findById(company);
        if (!companyDoc) {
            return next(new errorHandler('Company not found', 404));
        }

        // Check if the user exists
        const userData = await User.findById(user);
        if (!userData) {
            return next(new errorHandler('User not found', 404));
        }

        // Check if a transaction with the same user and company combination already exists
        const existingTransaction = await Transaction.findOne({ user, company });
        if (existingTransaction) {
            return next(new errorHandler('A transaction with the same user and company  already exists', 400));
        }
        // Calculate the amount based on the lot size and company amount
        const amount = lotSize * companyDoc.amount;

        // Create a new transaction
        const transaction = new Transaction({
            user, company, lotSize, appliedDate, grantedBy, amount, is_own, remarks, applicationNo, is_alloted,
            createdBy: req.user.id, updatedBy: req.user.id
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        next(err);
    }
};

exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find()
            .populate('user', 'name ')
            .populate('company', 'name ')
            .populate('grantedBy', 'name ');
        res.status(200).json(transactions);
    } catch (err) {
        next(err);
    }
};

exports.getTransactionById = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Company ID is required' });
    }

    const company = await Company.findById(id);
    if (!company) {
        return res.status(404).json({ error: 'Company not found' });
    }

    try {
        const transactions = await Transaction.find({ company: id }).sort({ createdAt: -1 })
            .populate('user', 'name ')
            .populate('grantedBy', 'name ');
        res.status(200).json(transactions);
    } catch (err) {
        next(err);
    }
};

exports.updateTransaction = async (req, res, next) => {
    try {
        const { lotSize, appliedDate, grantedBy, is_own, is_alloted, remarks, applicationNo } = req.body;

        // Find the transaction by id
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return next(new errorHandler('Transaction not found', 404));
        }

        // Check if the company exists
        const companyDoc = await Company.findById(transaction.company);
        if (!companyDoc) {
            return next(new errorHandler('Company not found', 404));
        }
        // Check if a transaction with the same user and company combination already exists
        // const existingTransaction = await Transaction.findOne({ user, company });
        // if (existingTransaction) {
        //     return next(new errorHandler('A transaction with the same user and company  already exists', 400));
        // }
        // Update the transaction fields
        transaction.lotSize = lotSize || transaction.lotSize;
        transaction.appliedDate = appliedDate || transaction.appliedDate;
        transaction.grantedBy = grantedBy || transaction.grantedBy;
        transaction.is_own = is_own !== undefined ? is_own : transaction.is_own;
        transaction.is_alloted = is_alloted !== undefined ? is_alloted : transaction.is_alloted;
        transaction.amount = lotSize ? lotSize * companyDoc.amount : transaction.amount;
        transaction.remarks = remarks || transaction.remarks;
        transaction.applicationNo = applicationNo || transaction.applicationNo;
        transaction.updatedBy = req.user.id;
        transaction.updatedAt = Date.now();

        await transaction.save();
        res.status(200).json(transaction);
    } catch (err) {
        next(err);
    }
};

exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return next(new errorHandler('Transaction not found', 404));
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        next(err);
    }
};
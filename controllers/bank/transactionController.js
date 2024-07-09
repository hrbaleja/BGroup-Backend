const Account = require('../../models/bank/Account');
const Transaction = require('../../models/bank/Transaction');
const { STATUS, MESSAGES, TRANSACTION_TYPES } = require('../../constants/bank');
const ErrorHandler = require('../../utils/errorHandler');

exports.deposit = async (req, res, next) => {
    try {
        const { customerId, amount, description } = req.body;
        const customer = await Account.findById(customerId);
        if (!customer) {
            return res.status(STATUS.NOTFOUND).json({ message: MESSAGES.ACCOUNT_NOTFOUND })
        }

        const transaction = await Transaction.create({
            customer: customerId,
            type: TRANSACTION_TYPES.DEPOSIT,
            amount,
            description
        });

        const amountd = parseFloat(amount)
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
            return res.status(STATUS.NOTFOUND).json({ message: MESSAGES.ACCOUNT_NOTFOUND })
        }

        // if (customer.balance < amount) {
        //      return res.status(STATUS.NOTFOUND).json({ message: MESSAGES.INSUFFICIENT_BALANCE })
        // }

        const transaction = await Transaction.create({
            customer: customerId,
            type: TRANSACTION_TYPES.WITHDRAWAL,
            amount,
            description
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

exports.getTransactions = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.ACCOUNT_REQUIRED })
        }

        const customer = await Account.findById(id);
        if (!customer) {
            return res.status(STATUS.NOTFOUND).json({ message: MESSAGES.ACCOUNT_NOTFOUND })
        }

        const transactions = await Transaction.find({ customer: id }).sort({ createdAt: -1 });

        let remainingBalance = customer.balance;
        let totalWithdrawals = 0;
        let totalDeposits = 0;

        const formattedTransactions = transactions.map(transaction => {
            if (transaction.type === 'withdrawal') {
                remainingBalance -= transaction.amount;
                totalWithdrawals += transaction.amount;
            } else if (transaction.type === 'deposit') {
                remainingBalance += transaction.amount;
                totalDeposits += transaction.amount;
            }

            return {
                id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt
            };
        });

        res.json({
            transactions: formattedTransactions,
            remainingBalance,
            totalWithdrawals,
            totalDeposits
        });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TRANSACTION_ERRGET, STATUS.SERVER_ERROR));
    }
};

exports.getTransactionsd = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        if (!customerId) {
            return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.ACCOUNT_REQUIRED })
        }
        
        const customer = await Account.findById(customerId);
        if (!customer) {
            return res.status(STATUS.NOTFOUND).json({ message: MESSAGES.ACCOUNT_NOTFOUND })
        }

        const transactions = await Transaction.find({ customer: customerId }).sort({ createdAt: 1 });
        let balance = 0;
        const formattedTransactions = [];
        for (const transaction of transactions) {
            if (transaction.type === 'withdrawal') {
                balance -= transaction.amount;
                formattedTransactions.push({
                    txnDate: transaction.createdAt,
                    description: transaction.description,
                    txnId: transaction._id,
                    debit: transaction.amount,
                    credit: null,
                    balance,
                });
            } else if (transaction.type === 'deposit') {
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
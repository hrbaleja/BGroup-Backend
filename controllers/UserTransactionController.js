const Customer = require('../models/Customer');
const UserTransaction = require('../models/UserTransaction');

exports.deposit = async (req, res, next) => {
    try {
        const { customerId, amount, description } = req.body;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const transaction = await UserTransaction.create({
            customer: customerId,
            type: 'deposit',
            amount,
            description
        });

        const amountd = parseFloat(amount)
        const oldBalance = parseFloat(customer.balance);
        const newBalance = oldBalance + amountd;

        customer.balance = newBalance;
        customer.updatedAt=Date.now();
        await customer.save();

        res.status(201).json(transaction);
    } catch (err) {
        next(err);
    }
};

exports.withdraw = async (req, res, next) => {
    try {
        const { customerId, amount, description } = req.body;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // if (customer.balance < amount) {
        //     return res.status(400).json({ error: 'Insufficient balance' });
        // }

        const transaction = await UserTransaction.create({
            customer: customerId,
            type: 'withdrawal',
            amount,
            description
        });

        customer.balance -= amount;
        customer.updatedAt=Date.now();
        await customer.save();

        res.status(201).json(transaction);
    } catch (err) {
        next(err);
    }
};



exports.getTransactions = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const transactions = await UserTransaction.find({ customer: id }).sort({ createdAt: -1 });

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
        next(err);
    }
};


exports.getTransactionsd = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        if (!customerId) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const transactions = await UserTransaction.find({ customer: customerId }).sort({ createdAt: 1 });
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
        next(err);
    }
};

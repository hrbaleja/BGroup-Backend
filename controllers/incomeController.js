const Income = require('../models/Income');
const errorHandler = require('../utils/errorHandler');
const Transaction = require('../models/Transaction');

// Create a new Income document
exports.createIncome = async (req, res, next) => {
  try {
    const { transactionId, profit, sharedProfit, finalAmount } = req.body;
    const transactionExist = await Transaction.findById(transactionId);
    if (!transactionExist) {
      throw new errorHandler('Transaction not found', 404);
    }

    // Create and save income data
    const incomeData = new Income(req.body);
    await incomeData.save();
    res.status(201).json(incomeData);
  } catch (error) {
    next(error);
  }
};

// Get all Income documents
exports.getIncomes = async (req, res, next) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (err) {
    next(err);
  }
};

// Get income summary
exports.getIncomeSummary = async (req, res) => {
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
      return res.status(404).json({ error: 'No income data found' });
    }

    res.json(incomeSummary[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Income documents by user ID
exports.getIncomesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const incomes = await Income.find({ 'transactionId.user': userId }).populate('transactionId');
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getIncomesByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const incomes = await Income.find({ 'transactionId.company': companyId }).populate('transactionId');
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get an Income document by ID
exports.getIncomeById = async (id) => {
  try {
    const income = await Income.findById(id);
    if (!income) {
      throw new errorHandler('Income not found', 404);
    }
    return income;
  } catch (err) {
    throw err;
  }
};

// Update an Income document by ID
exports.updateIncome = async (id, updatedData) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedIncome) {
      throw new errorHandler('Income not found', 404);
    }
    return updatedIncome;
  } catch (err) {
    throw err;
  }
};

// Delete an Income document by ID
exports.deleteIncome = async (id) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(id);
    if (!deletedIncome) {
      throw new errorHandler('Income not found', 404);
    }
    return { message: 'Income deleted successfully' };
  } catch (err) {
    throw err;
  }
};
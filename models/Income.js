const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true, },
    profit: { type: Number, required: true, },
    sharedProfit: { type: Number, required: true, },
    finalAmount: { type: Number, required: true, },
    createdAt: { type: Date, default: Date.now, },
    updatedAt: { type: Date, default: Date.now, },
}, { versionKey: false });

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
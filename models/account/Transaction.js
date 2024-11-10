const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Account.Account', required: true },
  type: { type: String, required: true, enum: ['deposit', 'withdrawal', 'loan', 'repayment'] },
  amount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const Transaction = mongoose.model('Account.Transaction', transactionSchema);

module.exports = Transaction;
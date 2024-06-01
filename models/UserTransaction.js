const mongoose = require('mongoose');

const usertransactionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, required: true, enum: ['deposit', 'withdrawal', 'loan', 'repayment'] },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

const UserTransaction = mongoose.model('UserTransaction', usertransactionSchema);

module.exports = UserTransaction;
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'IPO.Company', required: true },
  lotSize: { type: Number, required: true },
  appliedDate: { type: Date, required: true },
  is_own: { type: Boolean, default: false },
  grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  is_alloted: { type: Boolean, default: false },
  remarks: { type: String, required: false },
  applicationNo: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  versionKey: false
});

// Create a compound unique index on 'user' and 'company'
transactionSchema.index({ user: 1, company: 1 }, { unique: true });

const Transaction = mongoose.model('IPO.Transaction', transactionSchema);

module.exports = Transaction;
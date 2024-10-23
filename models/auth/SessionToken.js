const mongoose = require('mongoose');

const sessionTokenSchema = new mongoose.Schema({
    tokenId: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account.Account', required: true },
    createdAt: { type: Date, required: true, expires:'15m' },

});

const SessionToken = mongoose.model('SessionToken', sessionTokenSchema);

module.exports = SessionToken;
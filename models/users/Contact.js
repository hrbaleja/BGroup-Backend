// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    phone: { type: String, required: true, },
    whatsapp: { type: String, },
    email: { type: String, required: true, lowercase: true, },
    company: { type: String, },
    position: { type: String, },
    notes: { type: String, },
    favorite: { type: Boolean, default: false, },
    tags: { type: [String], enum: ['Work', 'Personal', 'Family', 'Business'], default: [], },
    createdAt: { type: Date, default: Date.now, },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, }
}, { versionKey: false });

module.exports = mongoose.model('User.Contact', contactSchema);

const mongoose = require('mongoose');

const menuSettingsSchema = new mongoose.Schema({
    category: { type: String, required: true },
    isVisible: { type: Boolean, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true, versionKey: false
  },);

const MenuSettings = mongoose.model('Setting.MenuSettings', menuSettingsSchema);

module.exports = MenuSettings;
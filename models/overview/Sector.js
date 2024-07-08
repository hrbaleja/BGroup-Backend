const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true,versionKey: false });

// Compound index to ensure uniqueness of name and date combination
sectorSchema.index({ name: 1, date: 1 }, { unique: true });

const Sector = mongoose.model('Overview.Sector', sectorSchema);

module.exports = Sector;
const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Assuming each sector name should be unique
  },
  value: {
    type: String,
    required: true,
    unique: true // Assuming each sector value should be unique
  }
}, { timestamps: true,versionKey: false });

const Sector = mongoose.model('Sector', sectorSchema);

module.exports = Sector;

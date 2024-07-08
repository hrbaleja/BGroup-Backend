const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  controller: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  errorMessage: {
    type: String,
   
  },
  errorStack: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Setting.ErrorLog', errorLogSchema);
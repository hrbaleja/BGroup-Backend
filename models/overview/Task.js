const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, },
  description: { type: String, },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
  createdAt: { type: Date, default: Date.now, },
  status: { type: Boolean, default: false, }
},
  { versionKey: false });

module.exports = mongoose.model('Overview.Task', taskSchema);
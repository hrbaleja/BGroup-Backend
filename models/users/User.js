const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Role = require('./Role');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  email: { type: String, required: true, unique: true, },
  password: { type: String, required: true, },
  role: { type: Number, required: true, default: 4, enum: [1, 2, 3, 4] },
  isVerified: { type: Boolean, default: false, required: true },
  isActive: { type: Boolean, default: false, required: true },
  updatedAt: { type: Date, default: Date.now },
  refreshToken: { type: String },
  lastLoginTime: { type: Date },
  hasDematAccount: { type: Boolean, default: false, },
  resetPasswordToken: { type: String }, 
  resetPasswordExpires: { type: Date }, 
}, {
  versionKey: false
});
userSchema.plugin(mongoosePaginate);
userSchema.index({ name: 'text' });

module.exports = mongoose.model('User', userSchema);
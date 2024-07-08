const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true
  },
  roleId: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 5
  },
  canView: {
    type: Boolean,
    required: true,
    default: true
  },
  canCreate: {
    type: Boolean,
    required: true,
    default: false
  },
  canEdit: {
    type: Boolean,
    required: true,
    default: false
  },
  canDelete: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('User.Role', roleSchema);
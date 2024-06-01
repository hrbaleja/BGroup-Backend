const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  bio: {
    type: String,
  },
  location: {
    city: String,
    state: String,
    country: String,
  },
  profilePicture: {
    type: String,
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
  },
  hasDematAccount: {
    type: Boolean,
    default: false,
  },
  bankAccount: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  panNumber: {
    type: String,
    unique: true,
  },
  aadhaarNumber: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
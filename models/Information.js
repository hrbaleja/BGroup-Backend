const mongoose = require('mongoose');

const InformationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entries: [
    {
      site: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
});

const Information = mongoose.model(
  'Information',
  InformationSchema
);

module.exports = Information;
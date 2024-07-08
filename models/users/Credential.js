const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for UserCredential
const CredentialSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  site: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String, default: '' }
});

// Create a model based on schema
const Credential = mongoose.model('User.Credential', CredentialSchema);

module.exports = Credential;

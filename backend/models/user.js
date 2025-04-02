const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Ensure username is required
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Ensure password is a String
  // Uncomment and use these fields if needed in the future
  // membership: { type: String, default: null },
  // funds: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);
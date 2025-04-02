const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membership: { type: String, default: null },
  funds: { type: Number, default: 0 }
});

module.exports = mongoose.model('user', UserSchema);
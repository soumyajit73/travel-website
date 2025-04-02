const mongoose = require('mongoose');

const MembershipLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('message', MembershipLogSchema);
const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [{
        date: {
            type: Date,
            default: Date.now
        },
        description: String,
        amount: Number
    }]
});

// Make sure to export the model correctly
module.exports = mongoose.model('Wallet', WalletSchema);
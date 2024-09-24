const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    history: [
        {
            order_id: {
                type: String,
                required: true
            },
            redeemedamount: {
                type: Number,
                required: true,
                default: 0
            },
            refundamount: {
                type: Number,
                required: true,
                default: 0
            },
            payment_method: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ]
})

const Wallet = mongoose.model('wallet', walletSchema)

module.exports = Wallet
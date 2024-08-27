const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    order_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    redeemedamount:{
        type:Number,
        required:true,
        default:0
    },
    refundamount:{
        type:Number,
        required:true,
        default:0
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    payment_method:{
        type:String,
        required:true
    }
})

const Wallet = mongoose.model('wallet',walletSchema)

module.exports = Wallet
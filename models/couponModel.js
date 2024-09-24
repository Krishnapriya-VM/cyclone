const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponname: {
        type: String,
        required: true
    }, 
    description:{ 
        type: String,
        required: true
    },
    couponcode: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "1"
    },
    couponlimit: {
        type:Number,
        required: true
    },
    reductionrate:{
        type:Number,
        required: true 
    },
    isListed:{
        type:Number,
        default: 0
    },
    usedBy:[{
        userid:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        orderid:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        usedAt:{
            type: Date,
            default: Date.now
        }
    }]
})

const Coupon = mongoose.model("coupon", couponSchema);

module.exports = Coupon;
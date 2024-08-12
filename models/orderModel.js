const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Address',
        required: true
    },
    products:[{
        product_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            default:"Processing"
        },
        image:{
            type: String,
            required: true
        }
    }],
    payment_method:{
        type:String,
        required:true
    },
    payment_status:{
        type:String,
        required:true
    },
    order_id:{
        type: String,
        default: "NIL"
    },
    payment_id:{
        type: String,
        default: "NIL"
    },
    total_amount:{
        type:Number,
        required:true
    }
})

const Order = mongoose.model('order', orderSchema);

module.exports = Order;
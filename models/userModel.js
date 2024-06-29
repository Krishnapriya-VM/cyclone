const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile_no:{
        type: Number,
        required: true,
        default:"0000000000"
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Number,
        default: 0
    },
    cart:{
        type:[
            {
                product_id:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product'
                },
                quantity:{
                    type: Number
                }
            }
        ],
        default: []
    },
    isBlocked:{
        type: Number,
        default: 0
    }

})
module.exports = mongoose.model("User", userSchema)






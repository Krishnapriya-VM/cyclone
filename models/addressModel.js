const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fname:{
        type: String,
        required:true
    },
    lname:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    houseno:{
        type: String,
        required: true
    },
    street_address:{
        type: String,
        required: true
    },
    landmark:{
        type: String,
        required: true
    },
    town:{
        type: String,
        required: true
    },
    district:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    isListed:{
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Address", addressSchema);
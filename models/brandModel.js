const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandname: {
        type: String,
        required: true
    },
    status:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    isListed:{
        type: Number,
        default: 0,
        required: true
    }
})

const Brand = mongoose.model("brand", brandSchema);

module.exports = Brand;
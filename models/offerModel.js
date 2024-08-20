const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    offertitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
})

const Offer = mongoose.model('offer',offerSchema)

module.exports = Offer
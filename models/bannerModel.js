const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannername: {
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

const Banner = mongoose.model("banner", bannerSchema);

module.exports = Banner;
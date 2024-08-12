const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Address = require("../../models/addressModel")
const Coupon  = require("../../models/couponModel")

const loadCheckOut = async (req, res) =>{
    try {
        const userid = req.userid;
        const udata = await User.findById({_id: userid}).populate('cart.product_id');

    
        const addressData = await Address.find({userid, isListed: 0});

        const subtotal = udata.cart.reduce((acc, item) => acc + (item.product_id.price * item.quantity), 0);
        const coupons = await Coupon.find({ couponlimit: { $lte: subtotal }, status: '1' }).sort({reductionrate: -1});
        const applicableCoupon = coupons.length > 0 ? coupons[0] : null;


        if(addressData){
            res.render("user/checkout",{
                udata: udata,
                addressData: addressData,
                coupons: applicableCoupon ? [applicableCoupon] : []
            })
        }else{
            console.log("Error in showing address");
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}

const applyCoupon = async(req, res)=>{
    const userid = req.userid;
    const { couponCode } = req.body;

    try{
        const user = await User.findById({_id: userid}).populate('cart.product_id');
        const coupon = await Coupon.findOne({couponcode:couponCode, status: '1'});

        if(!coupon){
            return res.status(400).json({message: 'Invalid or Expired Coupon CODE!! '});
        }

        const subtotal = user.cart.reduce((acc, item) => acc+ (item.product_id.price * item.quantity), 0);

        if(subtotal < coupon.couponlimit){
            return res.status(400).json({message: `Coupon is not applicable. Minimum order amount should be Rs. ${coupon.couponlimit}.`});
        }

        const isCouponUsed = coupon.usedBy.some( usage => usage.userid.toString() === userid.toString())

        if(isCouponUsed){
            return res.status(400). json({message: 'Coupon has already been used by this user.'})
        }

        const discountAmount = coupon.reductionrate;
        coupon.usedBy.push({userid})

        await coupon.save();

        return res.status(200).json({discountAmount})


    }catch(error){
        console.log(error.message);
        return res.status(500).json({ message: 'An error occurred while applying the coupon.' });
    }
}

module.exports = {
    loadCheckOut,
    applyCoupon
}
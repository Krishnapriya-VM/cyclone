const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Address = require("../../models/addressModel")
const Coupon  = require("../../models/couponModel")

const loadCheckOut = async (req, res) =>{
    try {
        const userid = req.userid;
        const udata = await User.findById({_id: userid}).populate({
                path: 'cart.product_id',
                populate:{ path: 'offer_id'}
            });

        const addressData = await Address.find({userid, isListed: 0});

        const subtotal = udata.cart.reduce((acc, item) => {
            const productPrice = item.product_id.price;
            const offer = item.product_id.offer_id;
            const finalPrice = offer ? productPrice - (productPrice * offer.discount / 100) : productPrice;
            return acc + (finalPrice * item.quantity)
        }, 0);

        const coupons = await Coupon.find({ 
            couponlimit: { $lte: subtotal }, 
            status: '1',
            usedBy: { $not: { $elemMatch: { userid: userid } } }   
            }).sort({reductionrate: -1});
            
        const applicableCoupon = coupons.length > 0 ? coupons[0] : null;


        if(addressData){
            res.render("user/checkout",{
                udata: udata,
                addressData: addressData,
                coupons: applicableCoupon ? [applicableCoupon] : [],
                sub: subtotal
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
    req.session.couponCode = couponCode
    try{
        const udata = await User.findById({_id: userid}).populate({
            path: 'cart.product_id',
            populate:{ path: 'offer_id'}
        });

        const coupon = await Coupon.findOne({ couponcode: couponCode, status: '1'});

        if(!coupon){
            return res.status(400).json({message: 'Invalid or Expired Coupon CODE!! '});
        }

        const subtotal = udata.cart.reduce((acc, item) => {
            const productPrice = item.product_id.price;
            const offer = item.product_id.offer_id;
            const finalPrice = offer ? productPrice - (productPrice * offer.discount / 100) : productPrice;
            return acc + (finalPrice * item.quantity)
        }, 0);

        console.log("SUBTOTAL", subtotal)

        if(subtotal < coupon.couponlimit){
            return res.status(400).json({message: `Coupon is not applicable. Minimum order amount should be Rs. ${coupon.couponlimit}.`});
        }

        const isCouponUsed = coupon.usedBy.some( usage => usage.userid.toString() === userid.toString())

        if(isCouponUsed){
            return res.status(400). json({message: 'Coupon has already been used by this user.'})
        }

        for(const item of udata.cart){
            const productPrice = item.product_id.price;
            const offer = item.product_id.offer_id;
            const finalPrice = offer ? productPrice - (productPrice * offer.discount / 100) : productPrice;
            const finalPriceWithCoupon = finalPrice - (coupon.reductionrate / udata.cart.length);

            if(finalPriceWithCoupon < productPrice / 2){
                return res.status(400).json({ message: 'No coupons applicable as discount drops price below allowed limit.' });
            }
        }

        const discountAmount = coupon.reductionrate;
        // coupon.usedBy.push({userid})

        //await coupon.save();

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
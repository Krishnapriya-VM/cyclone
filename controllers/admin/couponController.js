const Coupon = require('../../models/couponModel');

const loadCoupon = async (req, res) =>{
    try {
        const coupondata = await Coupon.find({isListed: 0});
        res.render("admin/coupon", {coupondata})
    } catch (error) {
        console.log(error.message)
    }
}

const postCoupon = async (req, res) =>{
    try {
        const { couponname, description, couponcode, reductionrate, couponlimit} = req.body;
        console.log(req.body);
        const coupondata = { 
            couponname, 
            description, 
            couponcode,
            couponlimit,
            reductionrate,
        }
        console.log(coupondata);
        const couponExistData = await Coupon.find({ isListed: 0 });
        let matched = 0;
        if(couponExistData){
            couponExistData.forEach((element) =>{
                if(element.couponname == couponname || element.couponcode == couponcode){
                    matched++;
                }
            })
        }
        if(matched === 0){
            const adddToCoupons = await Coupon.create(coupondata);
                if(adddToCoupons){
                    return res.status(200).json({message:'Coupon Added!'});

                }else{
                    res.json( {
                        message: "Error in adding coupon!!",
                        coupondata: couponExistData
                    })
                }
        }else{
            res.json( {
                message: "Coupon already exist!!",
                coupondata: couponExistData
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadEditCoupon = async (req, res) =>{
    try {
        const { id } = req.query;
        console.log("COUPONID",id)
        const coupondata = await Coupon.findById({_id: id});
        console.log("COUPONDATA", coupondata)
        res.render("admin/editcoupon", {coupondata})
    } catch (error) {
        console.log(error.message);
    }
}

const postEditCoupon = async(req, res) =>{
    try {
        const {id} = req.query;
        console.log("IDD", id);
        console.log("couponData", req.body)
        const { couponname, description, couponcode, couponlimit, reductionrate } = req.body;

        console.log( couponname, description, couponcode, couponlimit, reductionrate );
      
          const datatoedit = {
            couponname,
            description,
            couponlimit,
            reductionrate,
            couponcode: couponcode.toUpperCase(),
          };
      
          
          const nameExists = await Coupon.findOne({
            _id: { $ne: id },
            couponname: couponname,
            isListed: 0,
          });
      
          
          const codeExists = await Coupon.findOne({
            _id: { $ne: id },
            couponcode: couponcode.toUpperCase(),
            isListed: 0,
          });
      
          if (nameExists) {
            return res.status(400).json({ message: "Coupon name already exists!!" });
          }
      
          if (codeExists) {
            return res.status(400).json({ message: "Coupon code already exists!!" });
          }
      
          
          const edited = await Coupon.findByIdAndUpdate(id, { $set: datatoedit });
      
          if (edited) {
            res.status(200).json({ message: "Coupon updated successfully!!" });
          } else {
            res.status(400).json({ message: "Error updating coupon data!!" });
          }
        } catch (error) {
          console.log(error.message);
          res.status(500).json({
            message: "An error occurred. Please try again later.",
          });
        }
}

module.exports = {
    loadCoupon,
    postCoupon,
    loadEditCoupon,
    postEditCoupon
}
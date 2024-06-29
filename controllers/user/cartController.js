const User = require("../../models/userModel");
const Product = require("../../models/productModel");


const viewCart = async(req, res) =>{
    try{
        const uid = req.userid;
        const udata = await User.findById({ _id:uid}).populate("cart.product_id");
        console.log(udata);
        res.render('user/cart', {udata});
    }catch(error)   {
        console.log(error.message);
    }
}


const addToCart = async (req, res) =>{
    try {
        const uid = req.userid;
        const { id, qty } = req.query;
        const isExist = await User.find({ _id: uid, "cart.product_id": id});
        if(isExist.length === 0){
            const pdata = await Product.findById({ _id: id});
            if(qty <= pdata.stock){
                const updatedCart = await User.findByIdAndUpdate(
                    {_id: uid},
                    {$addToSet: {cart: {product_id: id, quantity: qty}}},
                    {new: true}
                )
                if(updatedCart){
                    pdata.stock = pdata.stock -1;
                    pdata.save();
                    res.json({data: "Item Added to Cart!"})
                }else{
                    res.json({err: "Failed to Add Item"})
                }
            }else{
                res.json({stockerr: `Only ${pdata.stock} Items left!!`})
            }
        }else{
            res.json({err: "Item Already Exist!!"})
        }
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    viewCart,
    addToCart
}
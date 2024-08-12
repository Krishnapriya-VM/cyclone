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
            if(pdata.stock === 0){
                res.json({err: "Out of Stock!"})
            }
            else if(qty > pdata.stock){
                res.json({err: `Only ${pdata.stock} Items left!!`})
            }
            else{
                const updatedCart = await User.findByIdAndUpdate(
                    {_id: uid},
                    {$addToSet: {cart: {product_id: id, quantity: qty}}},
                    {new: true}
                );
                if(updatedCart){
                    res.json({data: "Item Added to Cart!"})
                }else{
                    res.json({err: "Failed to Add Item"})
                }
            }
        }else{
            res.json({err: "Item Already Exist!!"})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const incrementQuantity = async(req, res) =>{
    try {
        const {id} = req.query;  
        console.log(id);
        const userid = req.userid;
        console.log(userid);
        const productData = await User.findOne({_id: userid, 'cart.product_id': id});
        console.log(productData);
        const stockData = await Product.findById({_id: id});
        console.log(stockData);
        if(productData){
            const index = productData.cart.findIndex(element => element.product_id == id);
            console.log(index);
            if(index >= 0){
                const currentQty = productData.cart[index].quantity;
                console.log(currentQty);
                if(stockData.stock <= currentQty){
                    res.status(400).json({err:'Stock Limit Exceeded!!'})
                    return
                }else{
                    const productUpdate = await User.findOneAndUpdate(
                        {_id:userid,'cart.product_id':id},
                        {$inc:{'cart.$.quantity':1}},
                        {new:true}
                    )
                    console.log("UPDATE",productUpdate);
                    res.status(200).json({success:true})
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ err: 'Server Error!' });
    }
}

const decrementQuantity = async(req, res) =>{
    try {
        const {id} = req.query;
        console.log(id);
        const userid = req.userid;
        console.log(userid);

        const productData = await User.findOne({_id: userid, 'cart.product_id': id})
        console.log(productData);

        if(productData){
            const index = productData.cart.findIndex(element => element.product_id == id)
            console.log(index);

            if(index >= 0){
                const currentQty = productData.cart[index].quantity;
                console.log(currentQty);
                if(currentQty <= 1){
                    res.status(400).json({ err: "Quantity cannot be less than 1" });
                }else{
                    const productUpdate = await User.findOneAndUpdate(
                        {_id: userid, 'cart.product_id': id},
                        {$inc: {'cart.$.quantity': -1}},
                        {new: true}
                    )
                    res.status(200).json({success: true});
                }
            }
        }
    }catch (error) {
        console.log(error.message)
        res.status(500).json({ err: 'Server Error!' });
    }
}

const deleteFromCart = async (req, res) =>{
    try {
        const userid = req.userid;
        const {id} = req.query;
        console.log("User, PROID",userid,id);
        const deleteItem = await User.findByIdAndUpdate(
            {_id: userid},
            {$pull: {cart: {product_id: id}}}
        )
        if(deleteItem){
            res.json({data: "Item removed from Cart!!"})
        }else{
            res.json({err: "Failed to remove item!!"})
        }
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    viewCart,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    deleteFromCart
}
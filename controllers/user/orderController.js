const User = require("../../models/userModel");
const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const Address = require("../../models/addressModel") 
const { ObjectId } = require("mongodb");

const placeOrder = async(req, res)=>{
    try {
        const {address_id, payment_method, subtotal, items, payment_status } = req.body;

        const userid = req.userid;
        const address = await Address.findById(address_id);
        if(!address){
            return res.status(400).json({message: 'Invalid Address!!'})
        }
        console.log(address);

        const user = await User.findById(userid);
        if (!user) {
            return res.status(400).json({ message: 'Invalid user' });
        }
        console.log(user);

        const products = [];
        for(const item of items){
            const product = await Product.findById(item.product_id);
            if(!product){
                return res.status(400).json({ message: `Invalid product ID: ${item.product_id}` });
            }
            products.push({
                product_id: product._id,
                quantity: item.quantity,
                price: item.price,
                image: product.mainimage,
                status: 'Processing'
            })
        }
        const totalAmount = products.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        const order = new Order({
            date: new Date(),
            userid,
            address_id,
            products,
            payment_method,
            payment_status,
            total_amount: totalAmount
        })

        await order.save();
        
        for(const product of products){

            await User.findOneAndUpdate(
                {_id: userid},
                {$pull: {cart: {product_id: product.product_id}}}
            )


            await Product.findByIdAndUpdate(
                {_id: product.product_id}, 
                {$inc: {stock: -product.quantity}}
            )
        }

        
        res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
    } catch (error) {
        console.error('Error placing order:', error);
       res.status(500).json({ message: 'Server error', error });
    }
}

const loadOrders = async (req, res) =>{
    try {
        const userid = req.userid;
        const orderid = req.query.id;
        const udata = await User.findById({_id: userid}).populate("cart.product_id");
        console.log(udata)
        const orderdata = await Order.findById({_id: orderid}).populate('address_id products.product_id')
        if(orderdata != null){
            res.render("user/order",{ 
                udata: udata,
                orderdata: orderdata
            })
        }else{
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error loading orders:', error.message);
        res.status(500).json({ message: 'Server error', error });
    }
}

const viewOrder = async(req, res) =>{
    try{
        const userid = req.userid;
        const orders = await Order.find({userid}).populate('address_id products.product_id');
        console.log(orders);
        res.render('user/orders', {orders})
    }catch(error){
        console.log(error.message);
        res.status(500).send('Server Error');
    }
}

const orderDetails = async(req, res) =>{
    try {
        const order = await Order.findOne({_id:req.query.id}).populate("address_id products.product_id")
        if (order) {
            res.render("user/order-details",{order})
        } else {
            res.status(404).send('Order not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching order details');
    }
}

module.exports = {
    loadOrders,
    placeOrder,
    viewOrder,
    orderDetails
}
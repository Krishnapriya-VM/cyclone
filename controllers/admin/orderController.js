const Order = require("../../models/orderModel");

const getOrders = async(req, res) =>{
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 

        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.find().populate('userid address_id products.product_id').skip((page - 1) * limit).limit(limit);
        
        res.render('admin/orders', { 
            orders,
            currentPage: page, 
            totalPages, 
            limit
        });
        
    } catch (error) {
        res.status(500).send('Error fetching orders');
    }
}

const viewOrderDetails = async(req, res) =>{
    try {
        const order = await Order.findOne({_id: req.query.id}).populate('userid address_id products.product_id');
        if (order) {
            res.render('admin/order-details', { order });
        } else {
            res.status(404).send('Order not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching order details');
    }
}


module.exports = {
    getOrders,
    viewOrderDetails
}
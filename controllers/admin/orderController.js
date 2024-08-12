const Order = require("../../models/orderModel");

const getOrders = async(req, res) =>{
    try {
        const orders = await Order.find().populate('userid address_id products.product_id');
        if (orders.length > 0) {
            res.render('admin/orders', { orders });
        } else {
            res.render('admin/no-orders');
        }
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
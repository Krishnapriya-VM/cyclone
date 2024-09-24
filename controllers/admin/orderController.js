const Order = require("../../models/orderModel");

const getOrders = async(req, res) =>{
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 

        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.find().populate('userid address_id products.product_id').sort({date: -1}).skip((page - 1) * limit).limit(limit);
        
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

const updateProductStatus = async(req, res) =>{ 
    try {
        const { productId, orderId, status } = req.body;

        const validStatus = ['Processing', 'Dispatched', 'Shipped', 'Delivered'];
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const product = order.products.find(p => p._id.toString() === productId);
       
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
       
        const currentStatusIndex = validStatus.indexOf(product.status);
        const newStatusIndex = validStatus.indexOf(status);

        if (newStatusIndex < currentStatusIndex) {
            return res.status(400).json({ success: false, message: `Cannot update to ${status} from ${product.status}` });
        }

        product.status = status;
        await order.save();

        return res.status(200).json({ success: true, message: 'Status updated successfully' });

    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


module.exports = {
    getOrders,
    viewOrderDetails,
    updateProductStatus
}
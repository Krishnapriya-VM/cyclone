const User = require("../../models/userModel");
const Order = require("../../models/orderModel");
const Offer = require("../../models/offerModel");
const Product = require("../../models/productModel");
const Address = require("../../models/addressModel");
const Wallet = require("../../models/walletModel");
const Coupon = require("../../models/couponModel")
const { ObjectId } = require("mongodb");

// const placeOrder = async(req, res)=>{
//     try {
//         const {address_id, payment_method, subtotal, items, payment_status } = req.body;

//         const userid = req.userid;
//         const address = await Address.findById(address_id);
//         if(!address){
//             return res.status(400).json({message: 'Invalid Address!!'})
//         }
//         console.log(address);

//         const user = await User.findById(userid);
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid user' });
//         }
//         console.log(user);

//         const products = [];
//         for(const item of items){
//             const product = await Product.findById(item.product_id);
//             if(!product){
//                 return res.status(400).json({ message: `Invalid product ID: ${item.product_id}` });
//             }
//             products.push({
//                 product_id: product._id,
//                 quantity: item.quantity,
//                 price: item.price,
//                 image: product.mainimage,
//                 status: 'Processing'
//             })
//         }
//         const totalAmount = products.reduce((sum, item) => sum + (item.price * item.quantity), 0)

//         const order = new Order({
//             date: new Date(),
//             userid,
//             address_id,
//             products,
//             payment_method,
//             payment_status,
//             total_amount: totalAmount
//         })

//         await order.save();
        
//         for(const product of products){

//             await User.findOneAndUpdate(
//                 {_id: userid},
//                 {$pull: {cart: {product_id: product.product_id}}}
//             )


//             await Product.findByIdAndUpdate(
//                 {_id: product.product_id}, 
//                 {$inc: {stock: -product.quantity}}
//             )
//         }

        
//         res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
//     } catch (error) {
//         console.error('Error placing order:', error);
//        res.status(500).json({ message: 'Server error', error });
//     }
// }

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
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const orders = await Order.find({userid}).sort({date: -1}).skip(skip).limit(limit).populate('address_id products.product_id');
        const totalOrders = await Order.countDocuments({ userid });

        const totalPages = Math.ceil(totalOrders / limit);

        console.log(orders);
        res.render('user/orders', 
            {orders,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            })
    }catch(error){
        console.log(error.message);
        res.status(500).send('Server Error');
    }
}

const orderDetails = async (req, res) => {
    try {
        // Fetch the order with populated product details
        const order = await Order.findOne({ _id: req.query.id })
            .populate("address_id products.product_id");

        if (!order) {
            return res.status(404).send('Order not found');
        }

        let couponReductionRate = 0;
        let totalOriginalPrice = 0;
        console.log("Orderrr",order);

        const coupon = await Coupon.findOne({ "usedBy.userid": req.user._id });

        if (coupon) {
            const couponUsedForThisOrder = coupon.usedBy.some(
                (entry) => entry?.orderid?.toString() === order._id.toString()
            );

            if (couponUsedForThisOrder) {
                couponReductionRate = coupon.reductionrate; // Get the coupon reduction rate
            }
            console.log("COUPON: ",couponUsedForThisOrder);
            console.log("COUPON Rate: ",couponUsedForThisOrder);

        }

        // Process each product in the order
        const processedProducts = await Promise.all(order.products.map(async (product) => {
            const productPrice = product.product_id.price * product.quantity;
            console.log("PRODUCT PRICE::::", productPrice);
            let offeredPrice = productPrice;

            totalOriginalPrice += productPrice;

            const fetchedProduct = await Product.findById(product.product_id._id).populate("offer_id");

            if (fetchedProduct.offer_id && fetchedProduct.offer_id.discount > 0) {
                const offer = fetchedProduct.offer_id;
                offeredPrice = productPrice - (productPrice * offer.discount / 100);
                console.log("OFFERED PRICE::", offeredPrice)
            }
            
            if (couponReductionRate > 0 && product.quantity > 0) {
                const perQuantityCouponDiscount = couponReductionRate / product.quantity;
                offeredPrice -= perQuantityCouponDiscount; // Apply the coupon discount
            }

            console.log("-----------------")
        
            console.log("pppppppppppppppppp",product);

            // Return an object for rendering purposes   
            return {
                ...product.toObject(),  // Keep the original fields intact,
                productPrice,       // Original price
                offeredPrice,        
            };
        }));     
        console.log("-----------------")
        console.log("processedProducts", processedProducts);
        
        res.render("user/order-details", {
            order,
            products: processedProducts,  // Send the processed products
            totalOriginalPrice,
            couponReductionRate  
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).send('Error fetching order details');
    }
};


const cancelOrder = async (req, res) => {
    try {
        const { orderId, productId } = req.body; // Get the order ID and product ID from the request

        // Find the order and check if it exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Find the product within the order's product list
        const product = order.products.find(p => p.product_id.toString() === productId);
        if (!product) {
            return res.status(404).send('Product not found in order');
        }

        console.log("Canceled Product: ", product)

        // Ensure product is cancelable based on its status
        const cancelableStatuses = ['Processing', 'Dispatched', 'Shipped'];
        if (!cancelableStatuses.includes(product.status)) {
            return res.status(400).send('Product cannot be canceled at this stage');
        }

        // Fetch the product details from the Product model
        const fetchedProduct = await Product.findById(product.product_id._id).populate('offer_id');

        console.log("FETCHED PRODUCT:", fetchedProduct)
        // Calculate the original and offered price
        const productPrice = fetchedProduct.price * product.quantity;
        console.log("PRODUCT PRICE", productPrice);
        let offeredPrice = productPrice;

        
        if (fetchedProduct.offer_id && fetchedProduct.offer_id.discount > 0) {
            const offer = fetchedProduct.offer_id;
            offeredPrice = productPrice - (productPrice * offer.discount / 100);
            console.log("Offered Price with Discount:", offeredPrice);
        }

        console.log("OFFER PRICE AFTER OFFER", offeredPrice)

        // Check if a coupon was applied and get the reduction rate
        
        let couponReductionRate = 0;
        const coupon = await Coupon.findOne({ "usedBy.userid": req.user._id });

        if (coupon) {
            const couponUsedForThisOrder = coupon.usedBy.some(
                (entry) => entry?.orderid?.toString() === orderId.toString()
            );

            if (couponUsedForThisOrder) {
                couponReductionRate = coupon.reductionrate; // Get the coupon reduction rate
                console.log("Coupon Reduction Rate:", couponReductionRate);
            }
        }

        // Apply the coupon reduction rate to the offered price
        if (couponReductionRate > 0 && product.quantity > 0) {
            const perQuantityCouponDiscount = couponReductionRate / product.quantity;
            offeredPrice -= perQuantityCouponDiscount; // Subtract per-quantity coupon discount from the offered price
            console.log("Price after Coupon Discount:", offeredPrice);
        }

        console.log("OFFER PRICE AFTER COUPON",offeredPrice);

        const finalRefundAmount = offeredPrice !== productPrice ? offeredPrice : productPrice;
        console.log("Final Refund Amount:", finalRefundAmount);
        
        // Update the user's wallet balance
        const walletUpdate = await Wallet.findOneAndUpdate(
            { user_id: req.user._id },
            { $inc: { balance: finalRefundAmount } },
            { new: true, upsert: true } // Ensure wallet exists or create a new one
        );

        // Add to wallet history for refund transaction
        await Wallet.updateOne(
            { user_id: req.user._id },
            {
                $push: {
                    history: {
                        order_id: orderId,
                        redeemedamount: 0,  // Since it's a refund, redeemedamount is 0
                        refundamount: finalRefundAmount,
                        payment_method: 'Refund',
                        date: Date.now(),
                    }
                }
            }
        );

        // Remove the product from the order (or update its status as canceled)
        await Order.updateOne(
            { _id: orderId, "products.product_id": productId },
            { $set: { "products.$.status": "Canceled" } }
        );

        await Product.findByIdAndUpdate(
            fetchedProduct._id,
            { $inc: { stock: product.quantity } }  // Add back the canceled quantity to the stock
        );

        res.status(200).json({ success: true, message: 'Product canceled and refund processed', walletUpdate });
    } catch (error) {
        console.error("Error canceling product:", error);
        res.status(500).send('Error canceling product');
    }
};

const returnOrder = async (req, res) =>{
    try {
        const { productId, orderId, returnReason, additionalReason } = req.body;

        // Find the order and check if it exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({ success: false, message: 'Order not found' });
        }

        // Find the product within the order's product list
        const product = order.products.find(p => p.product_id.toString() === productId);
        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found in order' });
        }

        // Check if the product is eligible for return
        if (product.status !== 'Delivered') {
            return res.status(400).send({ success: false, message: 'Product is not eligible for return' });
        }
             

        // Fetch the product details from the Product model
        const fetchedProduct = await Product.findById(product.product_id._id).populate('offer_id');

        console.log("FETCHED PRODUCT:", fetchedProduct)
        // Calculate the original and offered price
        const productPrice = fetchedProduct.price * product.quantity;
        console.log("PRODUCT PRICE", productPrice);
        let offeredPrice = productPrice;

        
        if (fetchedProduct.offer_id && fetchedProduct.offer_id.discount > 0) {
            const offer = fetchedProduct.offer_id;
            offeredPrice = productPrice - (productPrice * offer.discount / 100);
            console.log("Offered Price with Discount:", offeredPrice);
        }

        console.log("OFFER PRICE AFTER OFFER", offeredPrice)

        // Check if a coupon was applied and get the reduction rate
        
        let couponReductionRate = 0;
        const coupon = await Coupon.findOne({ "usedBy.userid": req.user._id });

        if (coupon) {
            const couponUsedForThisOrder = coupon.usedBy.some(
                (entry) => entry?.orderid?.toString() === orderId.toString()
            );

            if (couponUsedForThisOrder) {
                couponReductionRate = coupon.reductionrate; // Get the coupon reduction rate
                console.log("Coupon Reduction Rate:", couponReductionRate);
            }
        }

        // Apply the coupon reduction rate to the offered price
        if (couponReductionRate > 0 && product.quantity > 0) {
            const perQuantityCouponDiscount = couponReductionRate / product.quantity;
            offeredPrice -= perQuantityCouponDiscount; // Subtract per-quantity coupon discount from the offered price
            console.log("Price after Coupon Discount:", offeredPrice);
        }

        console.log("OFFER PRICE AFTER COUPON",offeredPrice);

        const finalRefundAmount = offeredPrice !== productPrice ? offeredPrice : productPrice;
        console.log("Final Refund Amount:", finalRefundAmount);
        
        // Update the user's wallet balance
        const walletUpdate = await Wallet.findOneAndUpdate(
            { user_id: req.user._id },
            { $inc: { balance: finalRefundAmount } },
            { new: true, upsert: true } // Ensure wallet exists or create a new one
        );

        // Add to wallet history for refund transaction
        await Wallet.updateOne(
            { user_id: req.user._id },
            {
                $push: {
                    history: {
                        order_id: orderId,
                        redeemedamount: 0,  // Since it's a refund, redeemedamount is 0
                        refundamount: finalRefundAmount,
                        payment_method: 'Refund',
                        date: Date.now(),
                    }
                }
            }
        );



        // Update the product status to "Returned"
        await Order.updateOne(
            { _id: orderId, "products.product_id": productId },
            { $set: { "products.$.status": "Returned", "products.$.returnReason": returnReason } }
        );

        // Optionally, update the stock if needed
        await Product.findByIdAndUpdate(fetchedProduct._id, {
            $inc: { stock: product.quantity }
        });

        res.status(200).json({ success: true, message: 'Product returned successfully' });
    } catch (err) {
        console.error('Error returning product:', err);
        res.status(500).json({ success: false, message: 'Error returning product' });
    }
}

const loadInvoice = async(req, res) =>{
    try {
        const orderId = req.query.id;
        const order = await Order.findById(orderId).populate('products.product_id userid address_id');
        
        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.render('user/invoice', { order });
    } catch (error) {
        
    }
}


module.exports = {
    loadOrders,
    viewOrder,
    orderDetails,
    cancelOrder,
    returnOrder,
    loadInvoice
}
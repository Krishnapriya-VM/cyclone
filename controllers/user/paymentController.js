const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Address = require("../../models/addressModel");
const Order = require("../../models/orderModel");
const mongoose = require("mongoose");
const Razorpay = require("../../utils/razorpay");
const Wallet = require("../../models/walletModel");
const Coupon = require("../../models/couponModel");

const paymentConfirm = async(req, res) =>{  
    try{
        const userid = req.userid;
        console.log("body",req.body);
        const {payment_method, address_id, subtotal, items } = req.body;
        console.log(req.session.couponCode)
        const couponCode = req.session.couponCode;

        if (payment_method === "COD" && subtotal > 1000) {
          return res.status(400).json({ message: "Cash On Delivery is not allowed for orders above 1000." });
        }

        let products = []
        for(let item of items){
            const productdata = await Product.findById({_id: item.product_id})

            products.push({
                product_id: item.product_id,
                quantity: item.quantity,
                image: productdata.mainimage,
                price: item.price
            })
        }

        let paystatus;
        if(payment_method === "COD"){
            paystatus = "Paid";
        }else{
            paystatus = "Pending"
        }

        if (payment_method === "Wallet") {
          const wallet = await Wallet.findOne({ user_id: userid });
          if (!wallet || wallet.balance < subtotal) {
              return res.status(400).json({ message: 'Insufficient wallet balance.' });
          }

          wallet.balance -= subtotal;
          wallet.redeemedamount += subtotal;
          wallet.history.push({
                order_id: new mongoose.Types.ObjectId(),
                redeemedamount: subtotal,
                refundamount: 0,
                payment_method: "Wallet",
                date: new Date()
            });
          await wallet.save();
          paystatus = "Paid"; 

        }

        const orderdata = {
            date: new Date(),
            userid: userid,
            address_id: address_id,
            products: products,
            payment_method: payment_method,
            payment_status: paystatus,
            total_amount: subtotal
        }
        console.log("orderData",orderdata);

        const orderSaved = await Order.create(orderdata);



        if (couponCode) {
          const coupon = await Coupon.findOne({ couponcode: couponCode, status: '1' });

          if (!coupon) {
              return res.status(400).json({ message: 'Invalid or Expired Coupon CODE!!' });
          }

          // Save the coupon usage with orderid and userid
          const isCouponUsed = coupon.usedBy.some( usage => usage.userid.toString() === userid.toString());

          if (isCouponUsed) {
              return res.status(400).json({ message: 'Coupon has already been used by this user.' });
          }

          coupon.usedBy.push({
              userid: userid,
              orderid: orderSaved._id,  // Save the order ID here
              usedAt: new Date()
          });

          await coupon.save();  // Save coupon usage
        }

        if (orderSaved != null) {
            for (let j = 0; j < products.length; j++) {
              await User.findOneAndUpdate(
                { _id: userid },
                { $pull: { cart: { product_id: products[j].product_id } } }
              );
      
              await Product.findByIdAndUpdate(
                { _id: products[j].product_id },
                { $inc: { stock: -products[j].quantity } }
              );
            }
      
            if (orderSaved.payment_method === "COD") {
              res.json({ cod: orderSaved._id });
            } else if (orderSaved.payment_method === "Razorpay") {
              try{
                const razorOrderId = await Razorpay.createOrderPayment(
                  orderSaved._id,
                  orderSaved.total_amount
                );
                console.log(razorOrderId);
                await Order.findByIdAndUpdate(
                  { _id: orderSaved._id },
                  { $set: { order_id: razorOrderId.id } },
                  { new: true }
                );
                const udata = await User.aggregate([
                  { $match: { _id: new mongoose.Types.ObjectId(userid) } },
                ]);
                console.log(udata);
                res.json({
                  razorpay: {
                    id: razorOrderId.id,
                    amount: razorOrderId.amount,
                    userdata: udata[0],
                    orderId: orderSaved._id,
                  },
                });
              }catch(error){
                if (error.message.includes('Amount Exceeds Limit')) {
                  await Order.findByIdAndUpdate(
                      { _id: orderSaved._id },
                      { $set: { payment_status: "Failed" } }
                  );
                  
                  return res.status(400).json({ message: 'Payment failed due to amount limit. Please try a different payment method or lower the order value.' });
                } else {
                  throw error;
                }
              }
            }else if (orderSaved.payment_method === "Wallet") {
              res.json({ wallet: orderSaved._id });
            }
          }
    }catch(error){
        console.log(error.message);
        res.status(500).json({ message: 'An error occurred while processing the payment.' });
    }
}

const verifyPayment = async (req, res) => {
    try {
      const { razorPayId, razorOrderId, razorSignature, realOrderID } = req.body;
      console.log(razorPayId, razorOrderId, razorSignature, realOrderID);
      const { createHmac } = require("node:crypto");
  
      const orderdata = await Order.findById({ _id: realOrderID });
      console.log(orderdata);
      const secret = process.env.razorpayKeySecret;
      const hash = createHmac("sha256", secret)
        .update(orderdata.order_id + "|" + razorPayId)
        .digest("hex");
      console.log(hash);
      if (hash === razorSignature) {
        const updateStatus = await Order.findByIdAndUpdate(
          { _id: realOrderID },
          { $set: { payment_status: "Paid", payment_id: razorPayId } }
        );
        // console.log(updateStatus)
        console.log("Success");
        res.json({ success: realOrderID });
      } else {
        console.log("Failure");
        res.json({ failure: realOrderID });
      }
    } catch (error) {
      console.log(error.message);
    }
};

const retryPayment = async (req, res) => {
  try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);
      console.log("Order",order)
      if (!order) {
          return res.status(404).json({ message: "Order not found." });
      }

      if (order.payment_status !== "Pending") {
          return res.status(400).json({ message: "Payment is not pending for this order." });
      }

      if (order.payment_method === "Razorpay") {
          
          const udata = await User.findById(order.userid);

          return res.json({
              razorpay: {
                  id: order.order_id, 
                  amount: order.total_amount,
                  userdata: udata,
                  orderId: order._id,
              },
          });
      } else if (order.payment_method === "Wallet") {

          const wallet = await Wallet.findOne({ user_id: order.userid });

          if (!wallet || wallet.redeemedamount < order.total_amount) {
              return res.status(400).json({ message: 'Insufficient wallet balance.' });
          }

          
          const razorOrder = await Razorpay.createOrderPayment(
              order._id,
              order.total_amount
          );

          order.order_id = razorOrder.id;
          order.payment_method = "Razorpay"; 
          await order.save();

          
          const udata = await User.findById(order.userid);

          return res.json({
              razorpay: {
                  id: razorOrder.id,
                  amount: razorOrder.amount,
                  userdata: udata,
                  orderId: order._id,
              },
          });
      } else {
          return res.status(400).json({ message: "Unsupported payment method for retry." });
      }
  } catch (error) {
      console.error("Error retrying payment:", error.message);
      res.status(500).json({ message: "An error occurred while retrying the payment." });
  }
};


module.exports = {
    paymentConfirm,
    verifyPayment, 
    retryPayment
}
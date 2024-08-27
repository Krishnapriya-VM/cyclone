const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Address = require("../../models/addressModel");
const Order = require("../../models/orderModel");
const mongoose = require("mongoose");
const Razorpay = require("../../utils/razorpay");

const paymentConfirm = async(req, res) =>{
    try{
        const userid = req.userid;
        console.log("body",req.body);
        const {payment_method, address_id, subtotal, items} = req.body;

        if (payment_method === "COD" && subtotal > 1000) {
          return res.status(400).json({ message: "COD is not allowed for orders above 1000." });
        }

        let products = []
        for(let item of items){
            const productdata = await Product.findById({_id:item.product_id})

            products.push({
                product_id: item.product_id,
                quantity: item.quantity,
                image:productdata.mainimage,
                price: item.price
            })
        }

        let paystatus;
        if(payment_method === "COD"){
            paystatus = "Paid";
        }else{
            paystatus = "Pending"
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
            }
          }
    }catch(error){
        console.log(error.message);
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

module.exports = {
    paymentConfirm,
    verifyPayment
}
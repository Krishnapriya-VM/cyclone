const Razorpay = require('razorpay');

let instance = new Razorpay({
    key_id: process.env.razorpayKeyID,
    key_secret: process.env.razorpayKeySecret
});

function createOrderPayment(orderid, totalAmount){
    var options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: orderid
    }
    return new Promise((resolve, reject) =>{
        instance.orders.create(options, function(err, order){
            if(err){
                console.log(err);
                reject(err);
            }else{
                console.log("Order" ,order);
                resolve(order);
            }
        })
    })
}

module.exports = {
    createOrderPayment
}
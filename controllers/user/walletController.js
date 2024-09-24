const Wallet = require("../../models/walletModel")
const User = require("../../models/userModel");
const Razorpay = require("../../utils/razorpay")

const loadWallet = async (req, res) =>{
    try{
        const userId  = req.userid;
        const udata = await User.findById({_id: userId}).populate("cart.product_id");
        const wallet = await Wallet.findOne({user_id: userId}) || {balance: 0, history: []};

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        wallet.history.sort((a, b) => b.date - a.date);

        const totalEntries = wallet.history.length;
        const paginatedHistory = wallet.history.slice(skip, skip + limit);
        const totalPages = Math.ceil(totalEntries / limit);

        res.render("user/wallet", 
        {   udata, 
            wallet: {
                balance: wallet.balance,
                history: paginatedHistory 
            },
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
        })
    }catch(error){
        console.log("Error loading wallet page:", error.message);
    }
}


const addFundsToWallet = async (req, res) => {
    try {
        const userid = req.userid;
        const { amount } = req.body;

        const razorOrder = await Razorpay.createOrderPayment(null, amount);
        console.log(razorOrder);

        res.json({
            razorpay: {
                id: razorOrder.id,
                amount: razorOrder.amount,
                currency: razorOrder.currency,
                orderId: razorOrder.id
            },
            message: 'Razorpay order created successfully.'
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error.message);
        res.status(500).json({ message: 'Failed to initiate payment.' });
    }
};

const confirmAddFundsToWallet = async (req, res) => {
    try {
        const { razorPayId, razorOrderId, razorSignature, amount } = req.body;
        const userid = req.userid;
        const { createHmac } = require("node:crypto");

        const secret = process.env.razorpayKeySecret;
        const hash = createHmac("sha256", secret)
            .update(razorOrderId + "|" + razorPayId)
            .digest("hex");

        if (hash === razorSignature) {

            let wallet = await Wallet.findOne({ user_id: userid });
            
            if (!wallet) {
                wallet = new Wallet({
                    user_id: userid,
                    balance: 0,
                    redeemedamount: 0,
                    refundamount: 0,
                    history: []
                });
            }

            const creditedAmount = amount / 100;

            wallet.refundamount += creditedAmount;
            wallet.balance += creditedAmount;

            wallet.history.push({
                order_id: razorOrderId, 
                redeemedamount: 0,
                refundamount: creditedAmount, 
                payment_method: "Razorpay", 
                date: new Date() 
            });

            await wallet.save();

            res.json({ success: true, message: 'Funds added to wallet successfully.' });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error.message);
        res.status(500).json({ message: 'Payment verification failed.' });
    }
};

const refundToWallet = async (userId, refundAmount, orderId) => {
    try {
        const wallet = await Wallet.findOne({ user_id: userId });
        
        if (wallet) {
            wallet.refundamount += refundAmount;
            wallet.balance += refundAmount;
            await wallet.save();
        } else {
            await Wallet.create({
                date: new Date(),
                user_id: userId,
                refundamount: refundAmount,
                balance: refundAmount,
                order_id: orderId,
                payment_method: 'Refund',
            });
        }
        
        console.log('Refund added to wallet.');
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadWallet,
    addFundsToWallet,
    confirmAddFundsToWallet,
    refundToWallet
}
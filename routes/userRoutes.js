const express = require("express");
const router = express.Router();

const userController = require("../controllers/user/userController");
const cartController = require("../controllers/user/cartController");
const checkoutController = require("../controllers/user/checkoutController");
const addressController = require("../controllers/user/addressController");
const orderController = require("../controllers/user/orderController")
const paymentController = require("../controllers/user/paymentController")
const userAuth = require("../middleware/userAuth");

const passport = require("passport");
require("../utils/passportConfig");

router.get("/google",userAuth.isLoggedOut, userController.googleWindow, passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/success", userAuth.isLoggedOut, passport.authenticate("google", { failureRedirect: "/user-login" }),userController.googleCallback);

router.get("/", userAuth.isHome, userController.loadHomePage);
router.get("/user-profile",userAuth.isLoggedIn, userController.loadProfile);

router.post("/user-profile",userAuth.isLoggedIn, userController.editProfile);
router.get("/view-orders", userAuth.isLoggedIn, orderController.viewOrder);
router.get("/order-details", userAuth.isLoggedIn, orderController.orderDetails);
router.get("/change-password", userAuth.isLoggedIn);
router.post("/change-password", userAuth.isLoggedIn)

router.get("/user-login", userAuth.isLoggedOut, userController.loadUserLogin);
router.post("/user-login", userAuth.isLoggedOut, userController.postLogin);

router.get("/reset-link", userAuth.isLoggedOut, userController.loadResetLink);
router.post('/reset-link',userAuth.isLoggedOut , userController.postReset);

router.get('/reset-otp',userAuth.isLoggedOut,userController.loadResetOtp);
router.post('/reset-otp',userAuth.isLoggedOut,userController.postResetOtp);
router.get('/reset-otp/resend',userAuth.isLoggedOut,userController.resentResetOtp)

router.get("/forgot-password", userAuth.isLoggedOut, userController.loadForgotPassword);
router.post("/forgot-password", userAuth.isLoggedOut, userController.postForgot);

router.get("/user-register", userAuth.isLoggedOut, userController.loadUserRegister);
router.post("/user-register", userAuth.isLoggedOut, userController.registerUser);

router.get("/user-otp", userAuth.isLoggedOut, userController.loadUserOtp);
router.post("/verify-otp", userAuth.isLoggedOut, userController.confirmUserOtp);
router.post("/verify-otp/resendOtp", userAuth.isLoggedOut, userController.resendOtp );

router.get("/productdetails", userAuth.isHome, userController.viewProduct)

router.get("/shop", userAuth.isHome, userController.viewShop);

router.get("/cart", userAuth.isLoggedIn, cartController.viewCart)
router.get("/addToCart", userAuth.isLoggedIn, cartController.addToCart);
router.get("/cart/increment-quantity", userAuth.isLoggedIn, cartController.incrementQuantity)
router.get("/cart/decrement-quantity", userAuth.isLoggedIn, cartController.decrementQuantity)
router.get("/cart/deleteCart", userAuth.isLoggedIn, cartController.deleteFromCart)

router.get("/address", userAuth.isLoggedIn, addressController.loadAddress);
router.get("/address/add-address", userAuth.isLoggedIn, addressController.loadAddAddress);
router.post("/address/add-address", userAuth.isLoggedIn, addressController.postAddAddress);

router.get("/address/edit-address/:id", userAuth.isLoggedIn, addressController.loadEditAddress);
router.post("/address/edit-address/:id", userAuth.isLoggedIn, addressController.postEditAddress);

router.delete('/address/remove-address/:id', userAuth.isLoggedIn, addressController.deleteAddress);

router.post("/apply-coupon", userAuth.isLoggedIn, checkoutController.applyCoupon)
router.get("/checkout", userAuth.isLoggedIn, checkoutController.loadCheckOut)

router.post("/place-order", userAuth.isLoggedIn, paymentController.paymentConfirm);
router.post("/verify-payment", userAuth.isLoggedIn, paymentController.verifyPayment)

router.get("/order", userAuth.isLoggedIn, orderController.loadOrders)

router.get("/logout",userAuth.isLoggedIn, userController.logOut);

router.use('*',(req,res)=>{
    res.render('user/user404')
})

module.exports = router;
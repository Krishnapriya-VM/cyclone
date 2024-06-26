const express = require("express");
const router = express.Router();

const userController = require("../controllers/user/userController");
const cartController = require("../controllers/user/cartController")
const userAuth = require("../middleware/userAuth");
const userModel = require("../models/userModel");
const passport = require("passport");
require("../utils/passportConfig");

router.get("/google",userAuth.isLoggedOut, userController.googleWindow, passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/success", userAuth.isLoggedOut, passport.authenticate("google", { failureRedirect: "/user-login" }),userController.googleCallback);

router.get("/", userAuth.isHome, userController.loadHomePage);
router.get("/user-profile",userAuth.isLoggedIn, userController.loadProfile);
router.get("/user-details", userAuth.isLoggedIn, userController.getProfile);
router.post("/edit-user-details",userAuth.isLoggedIn, userController.editProfile);


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

router.get("/shop", userAuth.isHome, userController.viewShop)

router.get("/cart", userAuth.isLoggedIn, cartController.viewCart)
router.get("/addToCart", userAuth.isLoggedIn, cartController.addToCart);
router.get("/cart/increment-quantity", userAuth.isLoggedIn)

router.get("/logout",userAuth.isLoggedIn, userController.logOut);

router.use('*',(req,res)=>{
    res.render('user/user404')
})

module.exports = router;
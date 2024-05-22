const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const userAuth = require("../middleware/userAuth")
const userModel = require("../models/userModel");
const passport = require("passport");
require("../utils/passportConfig");

router.get("/", userAuth.isHome, userController.loadHomePage);

router.get("/user-profile",userAuth.isLoggedIn, userController.loadProfile)

router.get("/user-login", userAuth.isLoggedOut, userController.loadUserLogin);
router.post("/user-login", userAuth.isLoggedOut, userController.postLogin);

router.get("/logout",userAuth.isLoggedIn, userController.logOut);

router.get("/google",userAuth.isLoggedOut, userController.googleWindow,passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/success", userAuth.isLoggedOut,passport.authenticate("google", { failureRedirect: "/user-login" }),userController.googleCallback);

router.get("/user-register", userAuth.isLoggedOut, userController.loadUserRegister);
router.post("/user-register", userAuth.isLoggedOut, userController.registerUser);

router.get("/verify-otp", userAuth.isLoggedOut, userController.verifyUserOtp);
router.post("/verify-otp", userAuth.isLoggedOut, userController.confirmUserOtp);

module.exports = router;

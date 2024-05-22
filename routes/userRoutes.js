const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const userAuth = require("../middleware/userAuth")
const userModel = require("../models/userModel");
const passport = require("passport");
require("../utils/passportConfig");

router.get("/", userAuth.isHome, userController.loadHomePage);

router.get("/user-profile",userAuth.isLoggedIn, userController.loadProfile)

router.get("/user-login", userController.loadUserLogin);
router.post("/user-login", userController.postLogin)

router.get("/google",userController.googleWindow,passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/success",passport.authenticate("google", { failureRedirect: "/user-login" }),userController.googleCallback);

router.get("/user-register", userController.loadUserRegister);

router.post("/user-register", userController.registerUser);

router.get("/verify-otp", userController.verifyUserOtp);
router.post("/verify-otp", userController.confirmUserOtp);

router.get("/logout", userController.logOut);

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("../utils/jwt")

let from = "";
const googleWindow = (req, res, next) => {
  from = req.query.from;
  console.log(from);
  next();
};

const googleCallback = async (req, res) => {
  console.log(req.user, from);
  if (from === "LOGIN") {
   
    const Email = req.user?.emails[0]?.value;
    const user = await User.findOne({ email: Email });
    const id = user._id.toString()
    if (user) {
      const payload = {
        _id : id
      }
      const verified = await bcrypt.compare(req.user.id, user.password);
      if (verified) {
        const token = jwt.createToken(payload);
        res.cookie("token", token, {secure: true, httpOnly: true})
        res.redirect("/");
      } else {
        res.redirect("/user-login");
      }
    } else {
      res.redirect("/user-login");
    }

  } else if (from === "SIGNUP") {
    // user insert data in database 
      const email = req.user?.emails[0]?.value;
      const hashedPassword = await bcrypt.hash(req.user.id, 10)
      console.log(hashedPassword);
      let user = await User.findOne({email: email});
      if(!user){
        user = new User({
          fname: req.user.name.givenName,
          lname: req.user.name.familyName,
          email: email,
          mobile_no: "0000000000",
          password: hashedPassword,
        })
        console.log(user);
        await user.save();
        
        res.redirect('/')
      }else {
        res.redirect('/user-register') 
      }
    
  } else {
    res.redirect("/user-login");
  }
};

const loadHomePage = async (req, res) => {
  try {

    const userid = req.userid 
    res.render("user/home-page",{userid});
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserRegister = async (req, res) => {
  try {
    res.render("user/user-register");
  } catch (error) {
    console.log(error.message);
  }
};

const registerUser = async (req, res) => {
  try {
    const { fname, lname, email, mobile_number, password, confirm_password } =
      req.body;
    console.log(req.body);
    const findUser = await User.findOne({ email });
    if (password === confirm_password) {
      if (!findUser) {
        var otp = generateOtp();
        const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.NODEMAILER_MAIL,
            pass: process.env.NODEMAILER_PASS,
          },
        });

        const message = await transporter.sendMail({
          from: process.env.NODEMAILER_MAIL,
          to: email,
          subject: "Verify Your Account",
          text: `Your otp is  ${otp}`,
          html: `<b> <h4> Your otp is  ${otp} </h4> </b>`,
        });
        console.log(otp);

        if (message) {
          req.session.userOtp = otp;
          console.log(req.session.userOtp);

          setTimeout(() => {
            req.session.userOtp = null;
            req.session.save();
          }, 60000);

          req.session.userData = req.body;
          console.log(req.session.userData);

          res.redirect("/verify-otp");
        } else {
          res.json("email-error");
        }
      } else {
        console.log("User already exist!!");
        res.render("user/user-register", {
          message: "User with this email already exist",
        });
      }
    } else {
      console.log("Password Doesn't Match!!");
      res.render("user/user-register", {
        message: "Password Doesn't Match!!",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

function generateOtp() {
  const digits = "1234567890";
  var otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

const verifyUserOtp = async (req, res) => {
  try {
    res.render("user/verify-otp");
  } catch (error) {
    console.log(error.message);
  }
};

const confirmUserOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (otp === req.session.userOtp) {
      const user = req.session.userData;
      const passwordHash = await securePassword(user.password);
      const saveUserData = new User({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        mobile_no: user.mobile_number,
        password: passwordHash,
      });
      console.log(saveUserData);
      await saveUserData.save();
      req.session.user = saveUserData._id;
      res.redirect("/user-login");
    } else {
      console.log("otp not matching");
      res.render("user/verify-otp", { message: "Wrong OTP" });
    }
  } catch (error) {}
};

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserLogin = async (req, res) => {
  try {
    res.render("user/user-login");
  } catch (error) {
    console.log(error.message);
  }
};

const postLogin = async(req, res)=>{
  try {
    console.log("post");
    const {email, password} = req.body;
    const user = await User.findOne({
      email : email, 
      isAdmin: 0
    })
    console.log(req.body);
    console.log(user);
    if(user != null){
      const passVerify = await bcrypt.compare(password, user.password);
      if(passVerify){
        const id = user._id.toString();
        const payload = {
          _id : id
        }
        const token = jwt.createToken(payload);
        res.cookie("token", token, {secure: true, httpOnly: true})
        res.redirect('/')
      } else{
        res.render('user/user-login', {message: "Invalid Password"})
      }
    }else{
      res.render('user/user-login', {message: "User not Found!!"})
    }
  } catch (error) {
    console.log(error.message);
  }
}

const logOut = async (req, res)=>{
  try {
    res.clearCookie("token");
    res.redirect('/')
  } catch (error) {
    console.log(error.message);
  }
}

const loadProfile = async (req, res) =>{
  try {
    const userid = req.userid
    const user = req.user
    res.render("user/user-profile",{user,userid})
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  loadHomePage,
  loadUserRegister,
  loadUserLogin,
  registerUser,
  verifyUserOtp,
  confirmUserOtp,
  googleCallback,
  googleWindow,
  postLogin,
  loadProfile,
  logOut
};

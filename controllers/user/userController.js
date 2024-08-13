const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("../../utils/jwt");
const { mailer } = require("../../utils/mailer");
const { generateOtp } = require("../../utils/generateOtp");
const flash = require('connect-flash');
const securePassword = require("../../utils/password");

const Product = require("../../models/productModel")

// let from = "";
const googleWindow = (req, res, next) => {
  // from = req.query.from;
  const from = req.query.from || "LOGIN";
  console.log('=====>',from);
  res.cookie('from',from,{secure:true , httpOnly:true});
  next();
};

const googleCallback = async (req, res) => {
  try {
  const from = req.cookies?.from || '';
  console.log(req.user,'--------->', from);
  if (from === "LOGIN") {
   console.log("gytgtgrftrfgtyughih");
    const Email = req.user?.emails[0]?.value;
    const user = await User.findOne({ email: Email });
    
    console.log("LOGINUSER",user);
    if (user) {
      const id = user._id.toString()
      console.log(req.user.id);
      const payload = { _id : id }
      const verified = await bcrypt.compare(req.user.id, user.password);
      console.log(verified);
      if (verified) {
        const token = jwt.createToken(payload);
        req.session.user = token;
        req.session.from = null;
        res.cookie("token", token, {secure: true, httpOnly: true})
        res.clearCookie('from')
        res.redirect("/");
      } else {
        res.redirect("/user-login");
      }
    } else {
      // console.log("flashed");
      // req.flash('error_msg',"Please register.")
      // res.redirect("/user-login");
      const email = req.user?.emails[0]?.value;
      console.log(email);
      const hashedPassword = await bcrypt.hash(req.user.id, 10)

      let  userData = new User({
        fname: req.user.name.givenName,
        lname: req.user.name.familyName,
        email: email,
        mobile_no: "0000000000",
        password: hashedPassword,
      })
      console.log("USER",userData);
      await userData.save();
      const id = userData._id
      const payload = {_id : id }
      const token = jwt.createToken(payload);
      res.cookie("token", token, {secure: true, httpOnly: true})
      //console.log("IS signed from SinUp??");
      res.clearCookie('from')
      res.redirect('/')
    }

  } else if (from === "SIGNUP") {
    // user insert data in database 
      console.log("kjbbkjbjkb");
      const email = req.user?.emails[0]?.value;
      console.log(email);
      const hashedPassword = await bcrypt.hash(req.user.id, 10)
      let user = await User.findOne({email: email});
      console.log(user);
      if(!user){
        user = new User({
          fname: req.user.name.givenName,
          lname: req.user.name.familyName,
          email: email,
          mobile_no: "0000000000",
          password: hashedPassword,
        })
        console.log("USER",user);
        await user.save();
        const id = user._id
        const payload = {_id : id }
        const token = jwt.createToken(payload);
        res.cookie("token", token, {secure: true, httpOnly: true})
        console.log("IS signed from SinUp??");
        res.clearCookie('from')
        res.redirect('/')
      }else {
        res.redirect('/user-login') 
      }
    
  } else {
    res.redirect("/user-login");
  }
  } catch (error) {
    console.log(error);
  }
};

const loadHomePage = async (req, res) => {

  try {
    const userId = req.userid;
    const product = await Product.find({isListed:0}).populate("category_id")
    const allowedProducts = product.filter(pro=>pro.category_id.isListed === 0).slice(0,5)
    if (userId) {
      const user = await User.find({_id:userId});
      console.log(user);
      if (user) {
        console.log("dfsgdsf");
        res.render('user/home-page', { user:user, products:allowedProducts});
      } else {
        console.log("jhvjhv");
        res.render('user/home-page', { products:allowedProducts})
      }
    } else {
      console.log("hjvjhvjhv");
      res.render('user/home-page', { products:allowedProducts});
    }
  } catch (error) {
    console.log(error.message)
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
  console.log("Register Page");
  try {
    const { email, password, confirm_password } =req.body;
    console.log(req.body);
    const findUser = await User.findOne({ email });
    if (password === confirm_password) {
      if (!findUser) {
        var otp = generateOtp();
        const message = await mailer(otp,email)
      
        console.log(otp);
        console.log("MESSAGE: ", message);
        if (message) {
          console.log("entered");
          req.session.userOtp = otp;
          console.log(req.session.userOtp);

          setTimeout(() => {  
            req.session.userOtp = null;
            req.session.save();
          }, 60000);

          req.session.userData = req.body;
          console.log(" huuuhuhhh",req.session.userData);

          res.render("user/verify-otp");
        } else {
          res.json("email-error");
        }
      } else {
        console.log("User already exist!!");
        res.render("user/user-register", {
          message: "User Already Exist!!",
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


const loadUserOtp = async (req, res) => {
  try {
    res.render("user/verify-otp");
  } catch (error) {
    console.log(error.message);
  }
};

const confirmUserOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log(req.body);
    console.log("OTP: ", otp);
    console.log('SESSION :'+req.session.userOtp);
    if(req.session.userOtp){
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
          const id = saveUserData._id
          const payload = {
            _id : id
          }
          const token = jwt.createToken(payload);
          res.cookie("token", token, {secure: true, httpOnly: true})
          res.status(200).json({success:true});
        } else {
          console.log("OTP Timeout!!");
          res.status(400).json( { message: "Invalid OTP" });
        }
    }else{
      res.status(400).json( { message: "Time Limit Exceeded!! " });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const resendOtp = async (req, res) =>{
  console.log("Resend OTP controller...");
  try {
    
    var newOtp = generateOtp();
    const message = await mailer(newOtp,req.session.userData.email)

    console.log(newOtp);
    console.log("MESSAGE: ", message);

    if (message) {
 
      console.log("entered");
      console.log(newOtp, "newOtp")
      req.session.userOtp = newOtp;
      return res.status(200).json({message:'OTP resend successfully.'});

    } else {
      console.log("Mail Error");
      return res.status(400).json({error:'OTP resend error.'});

    }

  } catch (error) {
    console.log(error.message);
  }
}


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
          if(user.isBlocked === 0){
          const id = user._id.toString();
          const payload = {
            _id : id
          }
          const token = jwt.createToken(payload);
          res.cookie("token", token, {secure: true, httpOnly: true})
          res.redirect('/')
          }else{
          res.render('user/user-login', {message: "You are blocked by Admin!!"})
          }
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

// const getProfile = async (req, res) =>{
//   try {
//     id = req.userid;
//     const user = await User.findById(id);
//     res.render('user/user-profile', {user})
//   } catch (error) {
//     console.log(error.message);
//   }
// }

const loadProfile = async (req, res) =>{
  try {
    const userid = req.userid
    const user = await User.findById(userid);
    console.log(user);
    res.render("user/user-profile", {user})
  } catch (error) {
    console.log(error.message);
  }
}

const editProfile = async (req, res) =>{
  try {
    const {fname,lname,mobile_number} = req.body
    console.log(fname,lname,mobile_number)
    const uid = req.userid
    const updated = await User.findOneAndUpdate(
      {_id: uid},
      {fname:fname, lname:lname, mobile_no: mobile_number},
      {new: true})
      if(updated){
        res.redirect("/user-profile")
      }else{
          res.render("user/user-profile", {error:"Failed to update profile"} )
        }
  } catch (error) {
    console.log(error.message);
  }
}

const loadChangePassword = async(req, res) =>{
  try{
    const userid = req.userid
    const user = await User.findById(userid);
    console.log(user);
    res.render('user/changePassword',{user})
  }catch(error){
    console.log(error.message)
  }
}

const postChangePassword = async(req, res) =>{
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userid = req.userid;
    const user = await User.findById(userid);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if(!isMatch){
      return res.status(400).json({error: "Current password is incorrect"});
    }

    if(newPassword !== confirmPassword){
      return res.status(400).json({error: "New passwords do not match"})
    }

    const hashedPassword = await securePassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({message: "Password updated successfully"});

  } catch (error) {
    console.log(error.message);
    res.status(500).json({error: "Server error"})
  }
}

const loadUser404Page = async (req, res) => {
  try {
    res.render("user/user404");
  } catch (error) {
    console.log(error.message);
  }
};

const loadResetLink = async (req, res) => {
  try {
    res.render("user/reset-passwordlink")
  } catch (error) {
    console.error(error.message);
  }
};

const postReset = async (req, res) =>{
  try {
    const {mail} = req.body;
    const userExist = await User.findOne({email:mail});
    if(userExist){
      const resetOtp = generateOtp()
      const sendMail = await mailer(resetOtp,mail);
      console.log(resetOtp);
      console.log("MESSAGE: ", sendMail);
  
      if (sendMail) {
  
        console.log("entered");
        console.log(resetOtp, "resetOtp")
        req.session.resetOTP = resetOtp;
        req.session.resetMail = mail;
        req.session.save();
        setTimeout(()=>{
          req.session.resetOTP = null;
          req.session.save()
        },60000)
        return res.status(200).json({message:'OTP send successfully.'});
  
      } else {
        console.log("Mail Error");
        return res.status(400).json({error:'OTP send error.'});
      }
    }else{
      return res.status(400).json({error:'NO SUCH USER EXISTS!'});
    }
  } catch (error) {
    console.log(error.message);
  }
}

const resentResetOtp = async (req,res)=>{
  try {
    const otp = generateOtp()
    const message = await mailer(otp,req.session.resetMail);
    console.log(otp);
    console.log("MESSAGE: ", message);

    if (message) {

      console.log("entered");
      console.log(otp, "resetOtp")
      req.session.resetOTP = otp;
      req.session.save();
      setTimeout(()=>{
        req.session.resetOTP = null;
        req.session.save()
      })
      return res.status(200).json({message:'OTP send successfully.'});

    } else {
      console.log("Mail Error");
      return res.status(400).json({error:'OTP send error.'});

    }
  } catch (error) {
    console.log(error.message);
  }
}

const loadResetOtp = async (req,res) =>{
  try {
    res.render('user/newPasswordOtp')
  } catch (error) {
    console.log(error.message);
  }
}

const postResetOtp = async (req,res) => {
  try {
    console.log(req.body);
    console.log(req.session.resetOTP)
    if(req.body.otp == req.session.resetOTP){
      return res.status(201).json({message:'OTP accepted.'})
    }else{
      return res.status(400).json({error:'Invalid OTP.'});
    }
  } catch (error) {
    console.log(error.message);
  }
}

const loadForgotPassword = async (req, res) => {
  try {
    res.render("user/forgot-password")
  } catch (error) {
    console.error(error.message);
  }
};

const postForgot = async (req,res)=>{
  try {
    console.log(req.body);
    const { newpass , confirmpass }  = req.body;
    console.log(req.session.resetMail);
    if(newpass === confirmpass){
      const hashed = await securePassword(confirmpass);
      const userUpdate = await User.findOneAndUpdate({email:req.session.resetMail},{$set:{password:hashed}});
      // res.redirect('/user-login');
      return res.status(200).json({message:'Password Updated Successfully.'})
    }else{
      res.status(400).json({error:'Password Mismatch!!'})
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error'});
  }
}
 
const viewProduct = async (req, res) => {

  try {
    const id = req.query.id
    const user = req.user
    const product = await Product.findOne({ _id: id }).populate("category_id brand_id");
    res.render('user/productDetails', { product, user })
  } catch (error) {
    console.log(error.message)
  }

}

const viewShop = async (req, res) => {

  try {
    const id = req.query.id
    const user = req.user
    const product = await Product.find({}).populate("category_id brand_id");
    res.render('user/shop', { product, user })
  } catch (error) {
    console.log(error.message)
  }

}

const viewWishlist = async(req, res) =>{
  try{
      const userid = req.userid;
      const udata = await User.findById({ _id:userid}).populate("wishlist.product_id");
      console.log(udata);
      res.render('user/wishlist', {udata});
  }catch(error)   {
      console.log(error.message);
  }
}

const addToWishlist = async(req, res) =>{
  try {
    const uid = req.userid;
    const { id} = req.query;
    const isExist = await User.find({ _id: uid, "wishlist.product_id": id});
    if(isExist.length === 0){
        const pdata = await Product.findById({ _id: id});
        // if(pdata.stock === 0){
        //     res.json({err: "Out of Stock!"})
        // }
        // else if(qty > pdata.stock){
        //     res.json({err: `Only ${pdata.stock} Items left!!`})
        // }
      
            const updatedCart = await User.findByIdAndUpdate(
                {_id: uid},
                {$addToSet: {wishlist: {product_id: id}}},
                {new: true}
            );
            if(updatedCart){
                res.json({data: "Item Added to Wishlist!"})
            }else{
                res.json({err: "Failed to Add Item"})
            }
        
    }else{
        res.json({err: "Item Already Exist!!"})
    }
  } catch (error) {
      console.log(error.message)
  }
}

const deleteFromWishlist = async (req, res) =>{
  try {
      const userid = req.userid;
      const {id} = req.query;
      console.log("User, PROID",userid,id);
      const deleteItem = await User.findByIdAndUpdate(
          {_id: userid},
          {$pull: {wishlist: {product_id: id}}}
      )
      if(deleteItem){
          res.json({data: "Item removed from Wishlist!!"})
      }else{
          res.json({err: "Failed to remove item!!"})
      }
  } catch (error) {
      console.log(error.message);
  }

}

module.exports = {
  loadHomePage,
  //getProfile,
  loadUserRegister,
  loadUserLogin,
  registerUser,
  loadUserOtp,
  confirmUserOtp,
  resendOtp,
  googleCallback,
  googleWindow,
  postLogin,
  loadProfile,
  logOut,
  loadChangePassword,
  postChangePassword,
  loadUser404Page,
  loadResetLink,
  loadForgotPassword,
  postForgot,
  postReset,
  loadResetOtp,
  resentResetOtp,
  postResetOtp,
  viewProduct,
  viewShop,
  editProfile,
  viewWishlist,
  addToWishlist,
  deleteFromWishlist
};
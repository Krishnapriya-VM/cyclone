const jwt = require("../utils/jwt")
const User = require("../models/userModel");
const {decode} = require("jsonwebtoken");


const isLoggedIn = async (req, res, next)=>{
    try {
        if(req.cookies.token){
            const decodeToken = await jwt.verifyToken(req.cookies.token)
            if(decodeToken){
                const user = await User.findOne({
                    _id: decodeToken._id,
                    isBlocked: 0
                })
                if(user === null){
                    res.redirect("/user-login")
                }else{
                    console.log("hfgggfj");
                    req.user = user
                    req.userid = decodeToken._id
                    next();
                }
            }else{
                res.redirect("/user-login")
            }
        }else{
            res.redirect("/user-login")
        }
    } catch (error) {
        console.log(error.message);
    }
}


const isHome = async (req, res, next) => {
    try {
        if (req.cookies.token) {
            const decodeToken = await jwttoken.verifytoken(req.cookies.token);
            if (decodeToken) {
                const user = await User.findOne({ _id: decodeToken._id, isBlocked: false });
                if (user === null) {
                    next();
                } else {
                    req.user = user
                    req.userid = decodeToken._id;
                    next();
                }
            } else {
                next()
            }
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message);
    }   
}


module.exports = {
    isLoggedIn,
    isHome

}
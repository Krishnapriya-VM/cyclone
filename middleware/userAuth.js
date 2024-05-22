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

const isLoggedOut = async (req, res, next)=>{
    try {
        if(req.cookies.token){
            const decodeToken = await jwt.verifyToken(req.cookies.token);
            if(decodeToken){
                const user = await User.findOne({
                    _id: decodeToken.id,
                    isBlocked: false
                });
                if(user === null){
                    next();
                }else{
                    req.userid = decoded.id;
                    res.redirect('/')
                }
            }else{
                console.log("error ccurred in decoding token");
                next();
            }
        }else{
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isHome = async (req, res, next) => {
    try {
        if (req.cookies.token) {
            const decodeToken = await jwt.verifyToken(req.cookies.token);
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
    isLoggedOut,
    isHome

}
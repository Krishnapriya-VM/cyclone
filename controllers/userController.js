const User =  require('../models/userModel');

const loadHomePage = async(req,res) => {
    try {
        res.render('user/home-page')
    } catch (error) {
        console.log(error.message);
    }
}

const loadUserRegister = async(req, res)=>{
    try {
        
        res.render('user/user-register')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadHomePage,
    loadUserRegister
}
const Admin = require('../models/userModel')

const loadAdminLogin = async(req, res)=>{
    try {
        res.render("admin/login")
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadAdminLogin
}
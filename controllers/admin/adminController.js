const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("../../utils/jwt");
require("dotenv").config();

const User = require('../../models/userModel');
const Admin = require('../../models/adminModel')

const loadAdminLogin = async(req, res)=>{
    try {
        res.render("admin/admin-login")
    } catch (error) {
        console.log(error.message);
    }
}

const adminLogin = async(req, res) =>{
    const {email, password} = req.body;
    console.log(req.body);
    try {
        const admin = await Admin.findOne({
            email: email,
        })

        if(admin !== null){
            const passVerify = await bcrypt.compare(password, admin.password);
            if(passVerify){
                const id = admin._id.toString();
                const payload = {
                    _id: id
                };
                const adminToken = jwt.createToken(payload);
                res.cookie("adminToken", adminToken, { secure: true, httpOnly: true});
                res.redirect('/admin/admin-dashboard')
            }else{
                console.log("Admin Login Error");
                res.render('admin/admin-login', {error: "Invalid Password!!"});
            }
        }else{
            console.log("Admin Login Error");
            res.render('admin/admin-login', {error: "Invalid User"});
        }
    } catch (error) {
        console.error("Error in login!!", error);
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const loadAdminHome = async(req, res) =>{
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogout = async (req, res)=>{
    try {
      res.clearCookie("adminToken");
      res.redirect('/admin/admin-login')
    } catch (error) {
      console.log(error.message);
    }
  }

module.exports = {
    loadAdminLogin,
    adminLogin,
    loadAdminHome,
    loadLogout
}
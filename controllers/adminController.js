const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
require("dotenv").config();


const Admin = require('../models/userModel');

const loadAdminLogin = async(req, res)=>{
    try {
        res.render("admin/admin-login")
    } catch (error) {
        console.log(error.message);
    }
}

const adminLogin = async(req, res) =>{
    const {eamil, password} = req.body;
    try {
        const admin = await User.findOne({
            email: email,
            isAdmin: 1
        })
        if(admin !== null){
            const passVerify = await bcrypt.compare(password, admin.password);
            if(passVerify){
                const id = admin._id.toString();
                const payload = {
                    _id: id
                };
                const adminToken = jwt.createToken(payload);
                
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadAdminHome = async(req, res) =>{
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadAdminLogin,
    loadAdminHome
}
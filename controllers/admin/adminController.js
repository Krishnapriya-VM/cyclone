const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("../../utils/jwt");
require("dotenv").config();

const User = require('../../models/userModel');
const Admin = require('../../models/adminModel');
const Order = require("../../models/orderModel")

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


const dashboardData = async (req, res) => {
    try {
      // Calculate total revenue
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$total_amount" } } }
      ]);
      console.log("Revenue:",totalRevenue);
  
      // Count total number of orders
      const totalOrders = await Order.countDocuments();
      console.log("orders:", totalOrders);

  
      // Count total number of products sold
      const totalProductsSold = await Order.aggregate([
        { $unwind: "$products" },
        { $group: { _id: null, total: { $sum: "$products.quantity" } } }
      ]);
      console.log("totalProductsSold:", totalProductsSold);

  
      // Fetch total number of users
      const totalUsers = await User.countDocuments();
      console.log("totalUsers", totalUsers);

  
      // Fetch recent orders
      const recentOrders = await Order.find().sort({ date: -1 }).limit(5).populate('userid products.product_id');
      console.log("recentOrders", recentOrders);

  
      // Send data to the frontend
      res.json({
        revenue: totalRevenue[0]?.total || 0,
        orders: totalOrders,
        productsSold: totalProductsSold[0]?.total || 0,
        users: totalUsers,
        recentOrders
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

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
    loadLogout,
    dashboardData
}
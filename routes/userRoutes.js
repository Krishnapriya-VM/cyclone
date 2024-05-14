const express = require("express");
const user_route = express();

const userController = require("../controllers/userController")


user_route.get("/",userController.loadHomePage)
user_route.get('/user-register',userController.loadUserRegister);

module.exports = user_route;
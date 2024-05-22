const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/cyclones_Database");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser")
require("dotenv").config()
require('./utils/passportConfig')
const passport = require('passport')

const express = require("express");
const app = express();

app.set("view engine","ejs")

app.use("/public",express.static(path.join(__dirname,"./public")))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser())

const adminRoute = require('./routes/adminRoutes')
app.use('/admin', adminRoute)

const userRoute = require('./routes/userRoutes');
app.use('/', userRoute)


app.listen(5000, ()=>{
    console.log("Server is running.....")
})
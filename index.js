const express = require("express");
require("dotenv").config()
const connectDB = require('./configurations/config')
const path = require("path");
const session = require("express-session");
const nocache = require('nocache')
const cookieParser = require("cookie-parser")
const {usererrorHandler} = require('./middleware/usererrorHandler');
const {adminerrorHandler} = require('./middleware/adminErrorHandler')

require('./utils/passportConfig')
const passport = require('passport')

const PORT = process.env.PORT || 3000;
connectDB.connection();

const app = express();

app.use(nocache())

app.set("view engine","ejs")

app.use("/public",express.static(path.join(__dirname,"./public")))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
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


app.use(adminerrorHandler)

const userRoute = require('./routes/userRoutes');
app.use('/', userRoute)

app.use(usererrorHandler);


app.listen(PORT, ()=>{
    console.log("Server is running.....")
})
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/cyclones_Database");
const path = require("path");

const express = require("express");
const app = express();

app.set("view engine","ejs")

app.use("/assets",express.static(path.join(__dirname,"./assets")))

const userRoute = require('./routes/userRoutes')
app.use('/', userRoute)

app.listen(5000, ()=>{
    console.log("Server is running.....")
})
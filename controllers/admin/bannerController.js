const path = require("path");
const fs = require("fs").promises;
const Banner = require("../../models/bannerModel");

const loadBanner = async(req, res)=>{
    try{
        const banner_details = await Banner.find();

        if(banner_details != null){
            res.render("admin/banner" , {data: banner_details})
        }else{
            res.render("admin/banner") 
        }
    }catch(error){
        console.log(error.message);
        res.render("admin/banner", {message: "ERROR! Please try again."})
    }
};

const addBanner = async (req, res)=>{
    try {
        const { banner_name, status } = req.body;
        const image = req.file.filename;
        console.log("req.file==>",req.file.filename);
        const data = {
            bannername: banner_name,
            status: status,
            image: image
        };
        console.log("BANNER DATA", data);
        const bannerExist = await Banner.findOne({
            bannername: new RegExp(banner_name, 'i'),
            isListed: 0
        })
        if(bannerExist === null){
            const banner_data = await Banner.create(data);
            if(banner_data != null){
                //res.redirect("/admin/brand")
                return res.status(200).json({message: 'Banner Added!'})
            }
        }else{
            const banner_details = await Banner.find({ isListed: 0});
            res.status(400).json({
                data: banner_details,
                message: "Banner Already Exist!!"
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadEditBanner = async(req, res) =>{
    try {
        const id = req.query.id;
        console.log(req.query);   
        const banner_data = await Banner.findById({_id: id});
        if(banner_data != ""){
            res.render("admin/editBanner", {banner_data: banner_data});
        }else{
            res.render("admin/editBanner", { message: "Cannot load banner data"})
        } 
    } catch(error) {
        console.log(error.message);
        res.render("admin/editBanner", { message: "An error occurred while loading banner data" });
    }
}

const postEditBanner = async(req, res) =>{
    try {
        const {banner_name, id, status} =req.body;
        const banner_image = req.file;
        console.log(banner_name, id, banner_image, status);
        const existingBanner = await Banner.findOne({
            bannername: new RegExp(banner_name, 'i'),
            _id: {$ne: id},
            isListed: 0
        });
        const banner_data = await Banner.findById({_id: id});
        if(existingBanner){
            res.render('admin/editBanner', {
                banner_data: {image: banner_data.image, bannername: banner_name},
                message: "Banner Already Exist!!"
            })
        }else{
            let updatedBanner;
            if(req.file){
                updatedBanner = await Banner.findByIdAndUpdate(
                {_id: id},
                {$set: {bannername: banner_name, staus: status, image: banner_image.filename}},
                {new: true}
                )
            }else{
                updatedBanner = await Banner.findByIdAndUpdate(
                {_id: id},
                {$set: {bannername: banner_name, status: status}},
                {new: true}
                )
            }
            console.log("Updated Data of BANNER: ", updatedBanner);
            res.redirect("/admin/banner")
        }
    } catch (error) {
        res.status(5000).send("An error occurred while updating the banner")
    }
}

const listBanner = async (req, res) =>{
    try {
        const bannerid = req.params.bannerid;
        console.log("bannerid", bannerid);
        const bannerDetails = await Banner.findById(bannerid);
        if(bannerDetails.isListed === 0){
            const updateBanner = await Banner.findByIdAndUpdate(bannerid, {isListed: 1})
            if(updateBanner){
                res.json({success: true, message: "Banner Unlisted"})
            }else{
                res.json({
                    success: false,
                    message: "Failed to update Banner!"
                });
            }
        }else{
            const updateBanner = await Banner.findByIdAndUpdate(bannerid,{
                isListed: 0
            });
            if(updateBanner){
                res.json({success: true, message: "Banner Listed"})
            }else{
                res.json({
                    success: false,
                    message: "Failed to update Banner"
                })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadBanner,
    addBanner,
    loadEditBanner,
    postEditBanner,
    listBanner
}
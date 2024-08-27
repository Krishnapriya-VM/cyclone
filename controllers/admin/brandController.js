const path = require("path");
const fs = require("fs").promises;
const Brand = require("../../models/brandModel");

const loadBrand = async(req, res)=>{
    try{
        const brand_details = await Brand.find();

        if(brand_details != null){
            res.render("admin/brand" , {data: brand_details})
        }else{
            res.render("admin/brand") 
        }
    }catch(error){
        console.log(error.message);
        res.render("admin/brand", {message: "ERROR! Please try again."})
    }
};

const addBrand = async (req, res)=>{
    try {
        const { brand_name, status } = req.body;
        const image = req.file.filename;
        console.log("req.file==>",req.file.filename);
        const data = {
            brandname: brand_name,
            status: status,
            image: image
        };
        console.log("BRAND DATA", data);
        const brandExist = await Brand.findOne({
            brandname: new RegExp(brand_name, 'i'),
            isListed: 0
        })
        if(brandExist === null){
            const brand_data = await Brand.create(data);
            if(brand_data != null){
                //res.redirect("/admin/brand")
                return res.status(200).json({message: 'Brand Added!'})
            }
        }else{
            const brand_details = await Brand.find({ isListed: 0});
            res.staus(400).json({
                data: brand_details,
                message: "Brand Already Exist!!"
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadEditBrand = async(req, res) =>{
    try {
        const id = req.query.id;
        console.log(req.query);   
        const brand_data = await Brand.findById({_id: id});
        if(brand_data != ""){
            res.render("admin/editBrand", {brand_data: brand_data});
        }else{
            res.render("admin/editBrand", { message: "Cannot load category data"})
        } 
    } catch(error) {
        console.log(error.message);
        res.render("admin/editBrand", { message: "An error occurred while loading brand data" });
    }
}

const postEditBrand = async(req, res) =>{
    try {
        const {brand_name, id, status} =req.body;
        const brand_image = req.file;
        console.log(brand_name, id, brand_image, status);
        const existingBrand = await Brand.findOne({
            brandname: new RegExp(brand_name, 'i'),
            _id: {$ne: id},
            isListed: 0
        });
        const brand_data = await Brand.findById({_id: id});
        if(existingBrand){
            res.render('admin/editBrand', {
                brand_data: {image: brand_data.image, brandname: brand_name},
                message: "Brand Already Exist!!"
            })
        }else{
            let updatedBrand;
            if(req.file){
                updatedBrand = await Brand.findByIdAndUpdate(
                {_id: id},
                {$set: {brandname: brand_name, staus: status, image: brand_image.filename}},
                {new: true}
                )
            }else{
                updatedBrand = await Brand.findByIdAndUpdate(
                {_id: id},
                {$set: {brandname: brand_name, status: status}},
                {new: true}
                )
            }
            console.log("Updated Data of BRAND: ", updatedBrand);
            res.redirect("/admin/brand")
        }
    } catch (error) {
        res.status(5000).send("An error occurred while updating the brand")
    }
}

const listBrand = async (req, res) =>{
    try {
        const brandid = req.params.brandid;
        console.log("brandid", brandid);
        const brandDetails = await Brand.findById(brandid);
        if(brandDetails.isListed === 0){
            const updateBrand = await Brand.findByIdAndUpdate(brandid, {isListed: 1})
            if(updateBrand){
                res.json({success: true, message: "Brand Unlisted"})
            }else{
                res.json({
                    success: false,
                    message: "Failed to update Brand!"
                });
            }
        }else{
            const updateBrand = await Brand.findByIdAndUpdate(brandid,{
                isListed: 0
            });
            if(updateBrand){
                res.json({success: true, message: "Brand Listed"})
            }else{
                res.json({
                    success: false,
                    message: "Failed to update Brand"
                })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadBrand,
    addBrand,
    loadEditBrand,
    postEditBrand,
    listBrand
}
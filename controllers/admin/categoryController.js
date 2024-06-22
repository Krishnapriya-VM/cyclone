const path = require("path");
const fs = require("fs").promises;
const Category = require("../../models/categoryModel");

const loadCategory = async (req, res) => {
  try {
    const category_details = await Category.find();

    if (category_details != null) {
      res.render("admin/category.ejs", { data: category_details });
    } else {
      res.render("admin/category");
    }
  } catch (error) {
    console.log(error.message);
    res.render("admin/category", { message: "ERROR! Please try again." });
  }
};

const addCategory = async (req, res) => {
  try {
    const { category_name, status } = req.body;
    const image = req.file.filename;
    const data = {
      categoryname: category_name,
      status: status,
      image: image,
    };
    const categoryExist = await Category.findOne({
      categoryname: new RegExp(category_name,'i'),
      isListed: 0,
    });
    if (categoryExist === null ) {
      const category_data = await Category.create(data);
      if (category_data != null) {
        res.redirect("/admin/category");
      }
    } else {
      const category_details = await Category.find({ isListed: 0 });
      res.render("admin/category", {
        data: category_details,
        message: "Category Already Exist!!",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditCategory = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(req.query);
    const category_data = await Category.findById({ _id: id });
    if (category_data != "") {
      res.render("admin/editcategory", { category_data: category_data });
    } else {
      console.log("Cannot load category data");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const postEditCategory = async (req, res) => {
  try {
    const { category_name, id, status } = req.body;
    const catimage = req.file;
    console.log(category_name, id, catimage, status);
    //const category = await Category.find({categoryname: category_name})
    const existingCategory = await Category.findOne({
      categoryname: new RegExp(category_name, 'i'),
      _id: { $ne: id },
      isListed: 0
    });
    const category_data = await Category.findById({_id: id});
    //if(category.length && !category[0]._id.equals(id)){
    if(existingCategory){
      res.render('admin/editcategory',{
        category_data: {image:category_data.image,categoryname:category_name}, 
        //Message spelling issue
        message: "Category Already Exist!!"
      })
    }else{
      let updatedCategory;
      if(req.file){
        updatedCategory = await Category.findByIdAndUpdate(
          {_id: id},
          {$set: {categoryname: category_name, status: status, image: catimage.filename }},
          {new: true}
        )
      }else{
        updatedCategory = await Category.findByIdAndUpdate(
          {_id: id},
          { $set: {categoryname: category_name, status: status}},
          { new: true}
        )
      }
      console.log("Updated Category Data:", updatedCategory);
      res.redirect('/admin/category')
    }
  } catch (error) {
    res.status(500).send("An error occurred while updating category")
  }
};

const listCategory = async (req, res) => {
  try {
    const catid = req.params.catid;
    console.log("******", catid);
    const categoryDetails = await Category.findById(catid);
    if (categoryDetails.isListed === 0) {
      const updateCategory = await Category.findByIdAndUpdate(catid, {
        isListed: 1,
      });
      if (updateCategory) {
         res.json({ success: true, message: "Category Unlisted" });
      } else {
         res.json({
          success: false,
          message: "Failed to update Category!",
        });
      }
    }else{
      const updateCategory = await Category.findByIdAndUpdate(catid, {
        isListed: 0,
      });
      if (updateCategory) {
         res.json({ success: true, message: "Category Listed" });
      } else {
         res.json({
          success: false,
          message: "Failed to update Category!",
        });
      }
      
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadCategory,
  addCategory,
  loadEditCategory,
  postEditCategory,
  listCategory,
};

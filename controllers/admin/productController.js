const path = require("path");
const fs = require("fs").promises;
const Category = require("../../models/categoryModel")
const Product = require("../../models/productModel");
const Brand = require("../../models/brandModel");
const Offer = require("../../models/offerModel");

const viewProducts = async(req,res)=>{
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; 
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const product_data = await Product.find().skip(skip).limit(limit);
    res.render('admin/viewproducts',{
      products: product_data,
      currentPage: page,
      totalPages: totalPages,
      limit: limit
    })
  } catch (error) {
    console.log(error.message);
  }
}

const loadProducts = async(req, res) =>{
    try {
        const category_data = await Category.find({isListed: 0})
        const brand_data = await Brand.find({isListed:0})
        const offer_data = await Offer.find({status: 1})
        res.render("admin/product", { category: category_data, brand: brand_data, offer: offer_data})
    } catch (error) {
        res.status(500).render("error");
    }
}

const addProducts = async(req, res) =>{
    try {
      const { productname, description, procategory, price, stock, brandname, offername} = req.body;
      console.log("FILES",req.files);
      let protrim = productname.trim();
      const isExist = await Product.findOne({ 
        productname: new RegExp(protrim, 'i' )});
      console.log(isExist);

      if (!isExist) {
        const main = req.files["mainimage"][0].filename;
        let img = [];
        req.files["imgs"].forEach((element) => {
          img.push(element.filename);
        });
        console.log(main);
        console.log(img);

        const prodata = {
          productname,
          description,
          brand_id: brandname,
          category_id: procategory,
          price,
          mainimage: main,
          image: img,
          stock,
          offer_id: offername
        };

        console.log(prodata);

        const prosaved = await Product.create(prodata);
        if (prosaved != null) {
          //res.redirect("/admin/products");
          return res.status(200).json({ message: 'Product Added!' });
        } else {
          console.log(prosaved);
          return res.status(500).json({ error: 'Product could not be saved' });
        }
      } else {
        const cdata = await Category.find({ status: 0 });
        const bdata = await Brand.find({status:0})
        const offdata = await Offer.find({status: 0})
        res.status(400).json({
          err: "Product Already Exists.",
          category: cdata,
          brand: bdata,
          offer: offdata
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({error: message})
    }
}

const editProduct = async (req, res) => {

  try {
    const id = req.query.id
    const prodata = await Product.findOne({ _id: id }).populate("category_id brand_id offer_id")
    console.log(prodata);
    const cdata = await Category.find({})
    const bdata = await Brand.find({})
    const offdata = await Offer.find({})
    res.render('admin/editProduct', { product: prodata, category: cdata, brand: bdata, offer: offdata })
  } catch (error) {
    console.log(error.message)
  }

}

const postEditProduct = async (req, res) => {

  try {
    console.log(req.body);
    const id = req.body.id
    const { productname, stock, procategory, price, description, brandname, offername } = req.body;
    

    let mainimage = '';
    let imgs = [];

    if (req.files.mainimage) {
      mainimage = req.files.mainimage[0].filename;
    }

    if (req.files.imgs) {
      req.files.imgs.forEach(file => {
        imgs.push(file.filename);
      });
    }

    console.log(req.files);
    console.log("MAINIMAGE", mainimage);
    console.log("IMAGES", imgs);

    
    if (mainimage.length !== 0 && imgs.length !== 0) {
      await Product.updateOne({ _id: id }, { productname: productname, stock: stock, brand_id: brandname, category_id: procategory, offer_id: offername, description: description, mainimage: mainimage, image: imgs , price: price})
    } else if (mainimage.length === 0 && imgs.length !== 0) {
      await Product.updateOne({ _id: id }, { productname: productname, stock: stock, brand_id: brandname, category_id: procategory, offer_id: offername, description: description, image: imgs, price: price })
    } else if (mainimage.length !== 0 && imgs.length === 0) {
      await Product.updateOne({ _id: id }, { productname: productname, stock: stock, brand_id: brandname, category_id: procategory, offer_id: offername, description: description, mainimage: mainimage, price: price })
    } else {
      await Product.updateOne({ _id: id }, { productname: productname, stock: stock, brand_id: brandname, category_id: procategory, offer_id: offername, description: description, price: price })
    }
    console.log("EDITED");
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error.message)
  }

}

const productListUnlist = async (req, res) => {

  try {
    const { id } = req.query
    const state = await Product.findById({ _id: id })
    if (state !== null) {
      if (state.isListed === 0) {
        const list = await Product.findOneAndUpdate(
          { _id: id },
          { $set: { isListed: 1 } },
          { new: 0 }
        )
        if (list !== null) {
          res.json({ unlist: "Product is listed" })
        } else {
          res.json({ err: "Error in unlisting" })
        }
      } else {
        const unlist = await Product.findOneAndUpdate(
          { _id: id },
          { $set: { isListed: 0 } },
          { new: 0 }
        )
        if (unlist !== null) {
          res.json({ list: "Product is unlisted" })
        } else {
          res.json({ err: "Error in unlisting" })
        }
      }
    } else {
      console.log('No action performed')
    }
  } catch (error) {
    console.log(error.message)
  }
}




module.exports = {
    loadProducts,
    addProducts,
    editProduct,
    postEditProduct,
    productListUnlist,
    viewProducts
}
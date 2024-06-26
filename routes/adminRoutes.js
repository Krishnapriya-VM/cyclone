const express = require("express");
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const upload = require('../utils/multer')
const categoryController = require('../controllers/admin/categoryController');
const brandController = require("../controllers/admin/brandController")
const productController = require("../controllers/admin/productController")

const adminController = require("../controllers/admin/adminController");
const manageUser = require("../controllers/admin/manageUser");

router.get("/admin-login", adminAuth.isLoggedOut, adminController.loadAdminLogin);
router.post("/admin-login",adminAuth.isLoggedOut, adminController.adminLogin)

router.get("/admin-dashboard", adminAuth.isLoggedIn, adminController.loadAdminHome);
router.get("/list-users", adminAuth.isLoggedIn, manageUser.loadUserList);
router.get("/block-and-unblock-users", adminAuth.isLoggedIn, manageUser.userBlockAndUnBlock);

router.get("/category", adminAuth.isLoggedIn, categoryController.loadCategory);
router.post("/category", adminAuth.isLoggedIn, upload.single('catimage'), categoryController.addCategory);

router.get("/editCategory", adminAuth.isLoggedIn, categoryController.loadEditCategory);
router.post("/editCategory", adminAuth.isLoggedIn, upload.single("catimage"), categoryController.postEditCategory)
router.get("/unlist-and-list-categories/:catid", adminAuth.isLoggedIn, categoryController.listCategory)

router.get("/brand", adminAuth.isLoggedIn, brandController.loadBrand);
router.post("/brand", adminAuth.isLoggedIn, upload.single("brand_image"), brandController.addBrand);

router.get("/editBrand", adminAuth.isLoggedIn, brandController.loadEditBrand);
router.post("/editBrand", adminAuth.isLoggedIn, upload.single("brand_image"), brandController.postEditBrand);
router.get("/unlist-and-list-brands/:brandid", adminAuth.isLoggedIn, brandController.listBrand)

router.get('/products',adminAuth.isLoggedIn, productController.viewProducts)
router.get("/addproducts", adminAuth.isLoggedIn, productController.loadProducts);
router.post("/addproducts", adminAuth.isLoggedIn, upload.fields([{name: "mainimage", maxCount: 1}, {name: "imgs", maxCount: 4}]), productController.addProducts)
router.get("/products/listUnlist", adminAuth.isLoggedIn, productController.productListUnlist)

router.get("/editProduct", adminAuth.isLoggedIn, productController.editProduct);
router.post("/editProduct", adminAuth.isLoggedIn, upload.fields([{ name: "mainimage", maxCount: 1 },{ name: "imgs", maxCount: 4 }]), productController.postEditProduct)

router.get("/logout", adminAuth.isLoggedIn, adminController.loadLogout);


router.use('*',(req,res)=>{
        res.render('admin/admin404')
    })
module.exports = router;
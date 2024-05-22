const express = require("express");
const router = express();

const adminController = require("../controllers/adminController");

router.get("/admin-login", adminController.loadAdminLogin)


module.exports = router;
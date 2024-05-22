const express = require("express");
const router = express();

const adminController = require("../controllers/adminController");

router.get("/admin-login", adminController.loadAdminLogin);
router.get("/admin-dashboard", adminController.loadAdminHome);

module.exports = router;
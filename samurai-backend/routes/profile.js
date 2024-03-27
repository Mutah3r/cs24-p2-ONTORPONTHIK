const express = require("express");
const router = express.Router();
const authController = require("../controllers/profile");

router.get('/',authController.getUserDetails)

module.exports = router;
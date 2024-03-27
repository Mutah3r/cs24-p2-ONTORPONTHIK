const express = require("express");
const router = express.Router();
const authController = require("../controllers/profile");

router.get('/',authController.getUserDetails)
router.put('/',authController.updateUserDetails)

module.exports = router;
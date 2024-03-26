const express = require("express");
const router = express.Router();
const authController = require("../controllers/users");

router.post('/',authController.Registration)
router.get('/',authController.getAllUsers)

module.exports = router;
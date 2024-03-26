const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post('/login',authController.Login)

module.exports = router;
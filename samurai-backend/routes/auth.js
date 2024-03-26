const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post('/reg',authController.Registration)

module.exports = router;
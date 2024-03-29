const express = require("express");
const router = express.Router();
const authController = require("../controllers/creation");

router.get('/sts/:token',authController.getSTSInformation)

module.exports = router;
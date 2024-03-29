const express = require("express");
const router = express.Router();
const authController = require("../controllers/creation");

router.get('/sts/:token',authController.getSTSInformation)
router.post('/sts',authController.createSTS)
router.get('/land/:token',authController.getLandfillInformation)
router.post('/land',authController.createLandfill)
router.post('/stsManage',authController.assignManagerToSTS)
router.post('/landManage',authController.assignManagerToLandfill)

module.exports = router;
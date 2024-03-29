const express = require("express");
const router = express.Router();
const authController = require("../controllers/creation");

router.get('/sts/:token',authController.getSTSInformation)
router.post('/sts',authController.createSTS)
router.get('/land/:token',authController.getLandfillInformation)
router.post('/land',authController.createLandfill)
router.post('/stsManage',authController.assignManagerToSTS)
router.post('/landManage',authController.assignManagerToLandfill)
router.post('/vehicleCreate' , authController.addVehicle)
router.get('/assign/:userId',authController.checkUserAssignment)

module.exports = router;
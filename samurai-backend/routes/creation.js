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
router.get('/allvehicle',authController.getAllVehicle)
router.post('/entry', authController.stsLog)
router.get('/entry/:token', authController.getSTSEntriesForManager)
router.post('/lentry', authController.createLandfillEntry)
router.get('/lentry/:token', authController.getLandfillEntries)
router.get('/assign/:userId',authController.checkUserAssignment)
router.get('/allsts/:token',authController.getAllSTS)
router.get('/allland/:token',authController.getAllLand)

module.exports = router;
const express = require("express");
const router = express.Router();
const authController = require("../controllers/creation");
const middleware = require("../middlewars/authentcation")

//all sts information
router.get('/sts/:token',middleware.isSystemAdmin,authController.getSTSInformation)
//sts create
router.post('/sts',middleware.isSystemAdminBody,authController.createSTS)
//all landfill information
router.get('/land/:token',middleware.isLandfillManager,authController.getLandfillInformation)
//landfill create
router.post('/land',middleware.isSystemAdminBody,authController.createLandfill)
//assign to sts manager
router.post('/stsManage',authController.assignManagerToSTS)
//assign to landfill manager
router.post('/landManage',authController.assignManagerToLandfill)
//add vehicle
router.post('/vehicleCreate' ,middleware.isSystemAdminBody, authController.addVehicle)
//get all vehicle
router.get('/allvehicle',authController.getAllVehicle)
//get all available vehicle for sts entry
router.get('/allstsvehicle',authController.getAvailableVehicleForSTS)
//get all available vehicle for Landfill entry
router.get('/alllandfillvehicle',authController.getAvailableVehicleForLandfill)
//create sts log
router.post('/entry', authController.stsLog)
//sts entries for all manager
router.get('/entry/:token', authController.getSTSEntriesForManager)
//create landfill entry
router.post('/lentry', authController.createLandfillEntry)
//landfill entries for all manager
router.get('/lentry/:token', authController.getLandfillEntries)
//check is user already assigned or not
router.get('/assign/:userId',authController.checkUserAssignment)
//get all sts logs
router.get('/allsts/:token',authController.getAllSTS)
//get all landfill logs
router.get('/allland/:token',authController.getAllLand)
//get all landfill logs for admin
router.get('/alllandentry/:token' ,authController.getLandfillEntriesAdmin)
//create billslip
router.get('/billslip/:token', authController.getBillingInfo)
//Fleet View
router.get('/fleetview', authController.getAvailableVehicleForSTSFleetView);
//Optimized fleet
router.get('/fleetoptimized', authController.getAvailableVehicleForSTSFleetOptimized)

module.exports = router;
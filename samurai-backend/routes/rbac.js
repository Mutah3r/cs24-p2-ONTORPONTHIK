const express = require("express");
const router = express.Router();
const authController = require("../controllers/rbac");

//router.post('/teacherRegistration',authController.TeacherRegistration)

router.get('/roles',authController.getAllRoles)
router.post('/roles',authController.postRoles)
router.post('/permissions',authController.updatePermissions)

module.exports = router;
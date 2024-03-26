const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post('/login',authController.Login)
router.get('/logout',authController.Login)
router.post('/change-password',authController.changePassword)
router.post('/reset-password/initiate',authController.initiatePasswordReset)
router.post('/reset-password/confirm',authController.confirmPasswordReset)

module.exports = router;
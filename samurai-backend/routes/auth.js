const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const middleware = require("../middlewars/authentcation");

router.post('/login',middleware.limiter,authController.Login)
router.post('/logout',authController.Logout)
router.post('/change-password',middleware.islogin, authController.changePassword)
router.post('/reset-password/initiate',authController.initiatePasswordReset)
//reset password
router.post('/reset-password/confirm', authController.confirmPasswordReset)
//reset password for app
router.post('/reset-password-app', authController.ResetPassword)

module.exports = router;
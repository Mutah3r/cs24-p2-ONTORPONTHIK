const express = require("express");
const router = express.Router();
const authController = require("../controllers/appRoute");

router.post('/normal_user', authController.addNormalUser);
router.post('/feedback', authController.addFeedback);
router.post('/post_social', authController.addPostSocial);
router.post('/volunteering', authController.addVolunteering);
router.get('/resource',authController.Resource);
router.get('/post',authController.post)

module.exports = router;
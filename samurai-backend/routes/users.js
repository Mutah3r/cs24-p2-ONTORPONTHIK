const express = require("express");
const router = express.Router();
const authController = require("../controllers/users");

router.post('/',authController.Registration)
router.get('/',authController.getAllUsers)
router.get('/:userId',authController.getUserById)
router.put('/:userId',authController.updateUser)
router.delete('/:userId',authController.deleteUser)

module.exports = router;
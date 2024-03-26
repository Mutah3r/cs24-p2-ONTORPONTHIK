const express = require("express");
const router = express.Router();
const authController = require("../controllers/users");

router.post('/',authController.Registration)
router.get('/roles',authController.getAllRoles)
router.get('/',authController.getAllUsers)
router.get('/:userId',authController.getUserById)
router.put('/:userId/roles',authController.updateUserRoles)
router.put('/:userId',authController.updateUser)
router.delete('/:userId',authController.deleteUser)
router.post('/roles',authController.postRoles)

module.exports = router;
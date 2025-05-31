const express = require('express');
const router = express.Router();
const authController = require('../../controllers/users/userController');

router.get('/',  authController.getAllUsersPage)
router.put('/:userId',  authController.updateUser);
router.put('/status/:userId', authController.updateStatus);
router.put('/password/:userId', authController.updatePassword);

module.exports = router;
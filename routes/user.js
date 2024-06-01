const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/', protect, authController.getAllUsers)

router.put('/:userId', protect, authController.updateUser);

router.put('/status/:userId', protect, authController.updateStatus);

router.put('/password/:userId', protect, authController.updatePassword);

module.exports = router;
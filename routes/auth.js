const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const refreshTokenController = require('../controllers/refreshTokenController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', refreshTokenController.refreshToken);

module.exports = router;
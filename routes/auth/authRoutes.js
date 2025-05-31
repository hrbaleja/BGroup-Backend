const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth/authController');


// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

// POST /api/auth/refreshtoken
router.post('/refreshtoken', AuthController.refreshToken);

// POST /api/auth/forgotPassword
router.post('/forgotpassword', AuthController.forgotPassword);

router.post('/resetpassword', AuthController.resetPassword);


module.exports = router;

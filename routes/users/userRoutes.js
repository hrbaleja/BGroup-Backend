const express = require('express');
const router = express.Router();
const authController = require('../../controllers/users/userController');

router.use((req, res, next) => {
    req.isDematUsers = req.query.isDematUsers === 'yes';
    next();
});

router.get('/',  authController.getAllUsers)
router.put('/:userId',  authController.updateUser);
router.put('/status/:userId', authController.updateStatus);
router.put('/password/:userId', authController.updatePassword);

module.exports = router;
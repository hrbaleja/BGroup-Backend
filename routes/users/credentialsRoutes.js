const express = require('express');
const router = express.Router();
const credentialController = require('../../controllers/users/credentialController');

router.post('/', credentialController.createUserCredential);
router.get('/', credentialController.getAllUserCredentials);
router.put('/:Id', credentialController.updateUserCredential);
router.delete('/:Id', credentialController.deleteUserCredential);

module.exports = router;

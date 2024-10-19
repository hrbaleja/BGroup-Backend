const express = require('express');
const router = express.Router();
const publicController = require('../../controllers/public/publicController');

router.get('/:customerId', publicController.getTransactionsd);

module.exports = router;

const express = require('express');
const router = express.Router();
const publicController = require('../../controllers/public/publicController');

router.get('/:sessionId', publicController.verifySessionToken);
router.post('/', publicController.genrateSessionToken);

module.exports = router;

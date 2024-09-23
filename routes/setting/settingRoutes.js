const express = require('express');
const router = express.Router();
const settingController = require('../../controllers/setting/settingController');

router.get('/errorlogs', settingController.fetchErrorLogs);

module.exports = router;

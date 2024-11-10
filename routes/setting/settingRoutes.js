const express = require('express');
const router = express.Router();
const settingController = require('../../controllers/setting/settingController');

router.get('/errorlogs', settingController.fetchErrorLogs);
router.get('/menuSettings', settingController.fetchMenuSettings);
router.post('/menuSettings', settingController.addOrUpdateMenuSettings);

module.exports = router;

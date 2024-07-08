const express = require('express');
const router = express.Router();
const dashboardController = require('@controllers/overview/dashboardController');

router.get('/', dashboardController.getDashboardStatistics);

module.exports = router;
const express = require('express');
const router = express.Router();
const DashboardController = require('../../controllers/overview/dashboardController');

router.get('/', DashboardController.getDashboardStatistics);

module.exports = router;
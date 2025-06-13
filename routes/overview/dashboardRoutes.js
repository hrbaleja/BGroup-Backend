const express = require('express');
const router = express.Router();
const DashboardController = require('../../controllers/overview/dashboardController');

router.get('/', DashboardController.getDashboardStatistics);
// router.get('/fiscal-year', DashboardController.getCurrentFiscalYearStats);

module.exports = router;

// this main route file 
const express = require('express');
const router = express.Router();


// Import routes
const transactionRoutes = require('./transactions');
const companiesRoute = require('./companies');
const taskRoutes = require('./task');
const customersRoutes=require("./customers");
const incomeRoutes = require('./income');
const authRoutes = require('./auth');
const companyController = require('../controllers/dashboardController');
const profileRoutes = require('./profile');
const informationRoutes = require('./information');
const userRoutes=require('./user');
const sectorRoutes = require('./sectorRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/companies', companiesRoute);
router.use('/tasks', taskRoutes);
router.use('/customers',customersRoutes)
router.use('/income',incomeRoutes)
router.use('/profile', profileRoutes);
router.use('/financialinformation',informationRoutes)
router.use('/users',userRoutes)
router.use('/sectors', sectorRoutes);

router.get('/company-statistics', companyController.getCompanyStatistics);

module.exports = router;

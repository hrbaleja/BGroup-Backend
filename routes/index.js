// this main route file 
const express = require('express');
const router = express.Router();

// Authication Check
const { protect } = require('../middleware/auth');

// User Auth files
const authRoutes = require('./auth/authRoutes');

//  Overview routes files
const dashboarRoutes = require('./overview/dashboardRoutes')
const sectorRoutes = require('./overview/sectorRoutes');
const taskRoutes = require('./overview/taskRoutes');

// Bank routes files
const accountRoutes = require("./account/accountRoutes");

// User routes files
const profileRoutes = require('./users/profileRoutes');
const credentialsRoutes = require('./users/credentialsRoutes');
const userRoutes = require('./users/userRoutes');

// Company routes files
const companiesRoute = require('./company/companiesRoutes');
const transactionRoutes = require('./company/transactionsRoutes');
const incomeRoutes = require('./company/incomeRoutes');

// Others
const incomesRoutes = require('./others/incomeRoutes')

// Setting 
const settingRoutes = require('./setting/settingRoutes')
// Auth
router.use('/auth', authRoutes);

// Overview
router.use('/dashboardinfo', protect, dashboarRoutes)
router.use('/sectors', protect, sectorRoutes);
router.use('/tasks', protect, taskRoutes);

// Bank
router.use('/accounts', protect, accountRoutes);

// User
router.use('/users', protect, userRoutes);
router.use('/profile', protect, profileRoutes);
router.use('/credentials', protect, credentialsRoutes);

// Company
router.use('/companies', protect, companiesRoute);
router.use('/transactions', protect, transactionRoutes);
router.use('/income', protect, incomeRoutes);

// other 
router.use('/other/incomes', protect, incomesRoutes)

// setting
router.use('/setting', protect, settingRoutes)

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const incomeController = require('../controllers/incomeController');

// Income routes
router.post('/', protect, incomeController.createIncome);
router.get('/', protect, incomeController.getIncomes);
router.get('/:id', protect, incomeController.getIncomeById);
router.put('/:id', protect, incomeController.updateIncome);
router.delete('/:id', protect, incomeController.deleteIncome);

// Routes for getting Incomes by specific criteria
router.get('/company/:companyId', protect, incomeController.getIncomesByCompany);
router.get('/user/:userId', protect, incomeController.getIncomesByUser);
router.get('/summary', protect, incomeController.getIncomeSummary);

module.exports = router;
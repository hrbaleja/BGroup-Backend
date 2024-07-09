const express = require('express');
const router = express.Router();
const incomeController = require('../../controllers/company/incomeController');

// Income routes
router.post('/', incomeController.createIncome);
router.get('/', incomeController.getIncomes);
router.get('/:id', incomeController.getIncomeById);
router.put('/:id', incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

// Routes for getting Incomes by specific criteria
router.get('/company/:companyId', incomeController.getIncomesByCompany);
router.get('/user/:userId', incomeController.getIncomesByUser);
router.get('/summary', incomeController.getIncomeSummary);

module.exports = router;
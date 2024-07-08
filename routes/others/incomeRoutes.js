const express = require('express');
const router = express.Router();
const incomeController = require('../../controllers/others/incomeController');

// Create a new income entry
router.post('/', incomeController.createIncome);

// Get all income entries
router.get('/', incomeController.getAllIncomes);

// Get a specific income entry
router.get('/:id', incomeController.getIncome);

// Update an income entry
router.put('/:id', incomeController.updateIncome);

// Delete an income entry
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
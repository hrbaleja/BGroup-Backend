const express = require('express');
const router = express.Router();
const {protect}=require('../middleware/auth');
const transactionController = require('../controllers/transactionController');


// Create a new transaction
router.post('/', protect, async (req, res, next) => {
  // if (!req.user.role.canCreate) {
  //   return next(new errorHandler('You do not have permission to create transactions', 403));
  // }
  transactionController.createTransaction(req, res, next);
});

// Get all transactions
router.get('/', protect, async (req, res, next) => {
   transactionController.getTransactions(req, res, next);
});

router.get('/:id', protect, async (req, res, next) => {
 
  transactionController.getTransactionById(req, res, next);
});

// Update a transaction
router.put('/:id', protect, async (req, res, next) => {
 
  transactionController.updateTransaction(req, res, next);
});

// Delete a transaction
router.delete('/:id', protect, async (req, res, next) => {
 
  transactionController.deleteTransaction(req, res, next);
});

module.exports = router;
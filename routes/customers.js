const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const customerController = require('../controllers/customerController');
const usertransactionController = require('../controllers/usertransactionController');


// Create a new transaction
router.post('/', protect, customerController.createCustomer);
router.get('/', protect, customerController.getCustomers);

// // Transaction routes
// router.post('/transactions/deposit', protect, transactionController.deposit);
// router.post('/transactions/withdraw', protect, transactionController.withdraw);
// router.get('/transactions', protect, transactionController.getTransactions);
router.post('/deposit', protect, usertransactionController.deposit);
router.post('/withdraw', protect, usertransactionController.withdraw);
router.get('/tr/:customerId', protect, usertransactionController.getTransactionsd);
router.get('/getnoncustomer', protect, customerController.getCustomerswithoutaccount);
module.exports = router;
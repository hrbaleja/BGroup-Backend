const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/account/accountController");
const transactionController = require("../../controllers/account/transactionController");

// Create a new account
router.post("/", accountController.createAccount);
router.get("/", accountController.getAccounts);
router.get("/drop", accountController.getAccountsd);
router.get("/getnoncustomer", accountController.getUsersWithoutAccount);

// Transaction routes
router.post("/deposit", transactionController.deposit);
router.post("/withdraw", transactionController.withdraw);
router.get("/transactions/:customerId", transactionController.getTransactionsd);
router.post('/filter',transactionController.getTransactionsByDate)

module.exports = router;

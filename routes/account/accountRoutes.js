const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/account/accountController");
const transactionController = require("../../controllers/account/transactionController");

//account routes
router.post("/", accountController.createAccount);
router.get("/", accountController.getAccounts);
router.get("/getallaccount", accountController.getAccountAll);
router.get("/getnoncustomer", accountController.getUsersWithoutAccount);
router.delete('/:accountId', accountController.deleteAccountAndTransactions);
router.post('/sendmail', accountController.sendTransactionEmail);

// Transaction routes
router.post("/deposit", transactionController.deposit);
router.post("/withdraw", transactionController.withdraw);
router.get("/transactions/:customerId", transactionController.getTransactionsd);
router.post('/filter',transactionController.getTransactionsByDate)

module.exports = router;

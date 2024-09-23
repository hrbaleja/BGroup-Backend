const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/bank/accountController");
const transactionController = require("../../controllers/bank/transactionController");

// Create a new account
router.post("/", accountController.createAccount);
router.get("/", accountController.getAccounts);
router.get("/getnoncustomer", accountController.getUsersWithoutAccount);

// Transaction routes

router.post("/deposit", transactionController.deposit);
router.post("/withdraw", transactionController.withdraw);
router.get("/tr/:customerId", transactionController.getTransactionsd);
module.exports = router;

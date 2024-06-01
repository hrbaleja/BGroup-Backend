const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

router.use((req, res, next) => {

    req.isArchived = req.query.archiveStatus === 'yes';
    next();
});
// Create a transaction
router.post('/', protect, companyController.createCompany);

// Route handler for getting active companies
router.get('/', protect, companyController.getCompanies);

// Update a transaction
router.put('/:id', protect, companyController.updateCompany);

// Update a transaction
router.get('/:id', protect, companyController.findCompanyById);

module.exports = router;
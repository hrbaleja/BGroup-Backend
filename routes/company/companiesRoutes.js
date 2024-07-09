const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company/companyController');

router.use((req, res, next) => {
    req.isArchived = req.query.archiveStatus === 'yes';
    next();
});
router.post('/', companyController.createCompany);
router.get('/', companyController.getCompanies);
router.put('/:id', companyController.updateCompany);
router.get('/:id', companyController.findCompanyById);

module.exports = router;
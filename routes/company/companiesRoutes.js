const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company/companyController');

router.use((req, res, next) => {
  req.isArchived = req.query.archiveStatus === 'yes';
  next();
});

router.get('/', companyController.getCompanies);
router.get('/:id', companyController.findCompanyById);
router.post('/', companyController.createCompany);
router.put('/:id', companyController.updateCompany);

module.exports = router;

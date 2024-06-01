const Company = require('../models/Company');
const ErrorHandler = require('../utils/ErrorHandler');

// Find companies with an end date before one month ago
exports.getActiveCompanies = async (req, res, next) => {

  try {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

// Find a company by ID
exports.findCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return next(new ErrorHandler('Company not found', 404));
    }
    res.status(200).json(company);
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

// Get all companies
// exports.getCompanies = async (req, res, next) => {
//   try {
//     const companies = await Company.find();
//     res.status(200).json(companies);
//   } catch (err) {
//     next(new ErrorHandler(err.message, 400));
//   }
// };
exports.getCompanies = async (req, res, next) => {
  try {
    const { isArchived } = req;
    if (isArchived) {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const companies = await Company.find({ endDate: { $gte: oneMonthAgo } });
      res.status(200).json(companies);
    } else {
      const companiesall = await Company.find();
      res.status(200).json(companiesall);
    }
  } catch (err) {
    console.error('Error:', err);
    next(new ErrorHandler(err.message, 400));
  }
};
// Create a new company
exports.createCompany = async (req, res, next) => {
  try {
    const { name, industry, startDate, endDate, amount, lotSize, isMain } = req.body;
    const company = new Company({
      name,
      industry,
      startDate,
      endDate,
      amount,
      lotSize,
      isMain,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
    });
    await company.save();
    res.status(201).json({ message: 'Company Created successfully' });
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

// Update a company
exports.updateCompany = async (req, res, next) => {
  try {
    const { name, industry, startDate, endDate, amount, lotSize, isMain } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        name,
        industry,
        startDate,
        endDate,
        amount,
        lotSize,
        isMain,
        updatedBy: req.user.id,
        updatedAt: Date.now()
      },

    );

    if (!updatedCompany) {
      return next(new ErrorHandler('Company not found', 404));
    }

    res.status(200).json(updatedCompany);
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

// Delete a company
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return next(new ErrorHandler('Company not found', 404));
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};
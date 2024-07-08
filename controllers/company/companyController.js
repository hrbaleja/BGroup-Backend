const Company = require('../../models/company/Company');
const { STATUS, MESSAGES } = require('../../constants/company');
const ErrorHandler = require('../../utils/errorHandler');

exports.getActiveCompanies = async (req, res, next) => {
    try {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const companies = await Company.find();
        res.status(STATUS.OK).json(companies);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.COMPANY_ERR_FETCH, STATUS.BAD_REQUEST));
    }
};

exports.findCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return next(new ErrorHandler(MESSAGES.COMPANY_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json(company);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.COMPANY_ERR_FETCH, STATUS.BAD_REQUEST));
    }
};

exports.getCompanies = async (req, res, next) => {
    try {
        const { isArchived } = req;
        let companies;
        if (isArchived) {
            const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            companies = await Company.find({ endDate: { $gte: oneMonthAgo } });
        } else {
            companies = await Company.find();
        }
        res.status(STATUS.OK).json(companies);
    } catch (err) {
        console.error('Error:', err);
        next(new ErrorHandler(MESSAGES.COMPANY_ERR_FETCH, STATUS.BAD_REQUEST));
    }
};

exports.createCompany = async (req, res, next) => {
    try {
        const { name, industry, startDate, endDate, amount, lotSize, isMain } = req.body;
        const updatedAmount = amount * lotSize;
        const company = new Company({
            name, industry, startDate, endDate, amount: updatedAmount, lotSize, isMain,
            createdBy: req.user.Id,
            updatedBy: req.user.Id,
        });
        await company.save();
        res.status(STATUS.CREATED).json({ message: MESSAGES.COMPANY_CREATED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.COMPANY_ERR_CREATE, STATUS.BAD_REQUEST));
    }
};

exports.updateCompany = async (req, res, next) => {
    try {
        const { name, industry, startDate, endDate, amount, lotSize, isMain } = req.body;
        const updatedAmount = amount * lotSize;
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            {
                name, industry, startDate, endDate, amount: updatedAmount, lotSize, isMain,
                updatedBy: req.user.id,
                updatedAt: Date.now()
            },
            { new: true }
        );
        if (!updatedCompany) {
            return next(new ErrorHandler(MESSAGES.COMPANY_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json({ message: MESSAGES.COMPANY_UPDATED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.COMPANY_ERR_UPDATE, STATUS.BAD_REQUEST));
    }
};

exports.deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return next(new ErrorHandler(MESSAGES.COMPANY_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json({ message: MESSAGES.COMPANY_DELETED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.COMPANY_ERR_DELETE, STATUS.BAD_REQUEST));
    }
};
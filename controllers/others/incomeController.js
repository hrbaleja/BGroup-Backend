const Income = require('../../models/others/Income');
const { STATUS, MESSAGES } = require('../../constants/others');
const errorHandler = require('../../utils/errorHandler');


// Create a new income entry
exports.createIncome = async (req, res, next) => {
  try {
    const {name, amount, method, description, category, date } = req.body;
    const createdBy = req.user.Id;

    const income = new Income({
      name,
      amount,
      method,
      description,
      category,
      date,
      createdBy,
      updatedBy: createdBy
    });
    await income.save();
    res.status(STATUS.CREATED).json({ message: MESSAGES.INCOME_CREATED });
  } catch (err) {
    next(new errorHandler(MESSAGES.INCOME_ERR_CREATE, STATUS.SERVER_ERROR));
  }
},

  // Get all income entries
  exports.getAllIncomes = async (req, res, next) => {
    try {
      const incomes = await Income.find({ createdBy: req.user.Id });
      res.status(STATUS.OK).json(incomes);
    } catch (err) {
      next(new errorHandler(MESSAGES.INCOME_ERR_FETCH, STATUS.SERVER_ERROR));
    }
  },

  // Get a specific income entry
  exports.getIncome = async (req, res, next) => {
    try {
      const income = await Income.findOne({ _id: req.params.id, createdBy: req.user.Id });
      if (!income) {
        return next(new errorHandler(MESSAGES.INCOME_NOTFOUND, STATUS.NOTFOUND));
      }
      res.status(STATUS.OK).json(income);
    } catch (err) {
      next(new errorHandler(MESSAGES.INCOME_ERR_FETCH, STATUS.SERVER_ERROR));
    }
  },

  // Update an income entry
  exports.updateIncome = async (req, res, next) => {
    try {
      const { name,amount, method, description, category, date } = req.body;
      const updatedIncome = await Income.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.Id },
        {
          name,
          amount,
          method,
          description,
          category,
          date,
          updatedBy: req.user.Id,
          updatedAt: Date.now()
        },
        { new: true }
      );

      if (!updatedIncome) {
        return next(new errorHandler(MESSAGES.INCOME_NOTFOUND, STATUS.NOTFOUND));
      }
      res.status(STATUS.OK).json({ message: MESSAGES.INCOME_UPDATED});
    } catch (err) {
      next(new errorHandler(MESSAGES.INCOME_ERR_UPDATE, STATUS.SERVER_ERROR));
    }
  },

  // Delete an income entry
  exports.deleteIncome = async (req, res, next) => {
    try {
      const deletedIncome = await Income.findOneAndDelete({ _id: req.params.id, createdBy: req.user.Id });
      if (!deletedIncome) {
        return next(new errorHandler(MESSAGES.INCOME_NOTFOUND, STATUS.NOTFOUND));
      }
      res.status(STATUS.OK).json({ message: MESSAGES.INCOME_DELETED });
    } catch (err) {
      next(new errorHandler(MESSAGES.INCOME_ERR_DELETE, STATUS.SERVER_ERROR));
    }
  }

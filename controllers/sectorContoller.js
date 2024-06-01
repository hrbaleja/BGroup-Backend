const Sector = require('../models/company/Sector');
const ErrorHandler = require('../utils/errorHandler');

// Get all sectors
exports.getAllSectors = async (req, res, next) => {
  try {
    const sectors = await Sector.find();
    res.status(200).json(sectors);
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Create a new sector
exports.createSector = async (req, res, next) => {
  try {
    const { name, value } = req.body;
    const sector = new Sector({ name, value });
    await sector.save();
    res.status(201).json(sector);
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

// Get a sector by ID
exports.getSectorById = async (req, res, next) => {
  try {
    const sector = await Sector.findById(req.params.id);
    if (!sector) {
      return next(new ErrorHandler('Sector not found', 404));
    }
    res.status(200).json(sector);
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Update a sector
exports.updateSector = async (req, res, next) => {
  try {
    const { name, value } = req.body;

    const updatedSector = await Sector.findByIdAndUpdate(
      req.params.id,
      { name, value },
      { new: true }
    );

    if (!updatedSector) {
      return next(new ErrorHandler('Sector not found', 404));
    }

    res.status(200).json(updatedSector);
  } catch (err) {
    next(new ErrorHandler(err.message, 400));
  }
};

// Delete a sector
exports.deleteSector = async (req, res, next) => {
  try {
    const sector = await Sector.findByIdAndDelete(req.params.id);
    if (!sector) {
      return next(new ErrorHandler('Sector not found', 404));
    }
    res.status(200).json({ message: 'Sector deleted successfully' });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

const Sector = require('../../models/overview/Sector');
const { STATUS, MESSAGES } = require('../../constants/overview');
const ErrorHandler = require('../../utils/errorHandler');

exports.getAllSectors = async (req, res, next) => {
    try {
        const sectors = await Sector.find().sort({ date: -1 }).select('date name value');
        res.status(STATUS.OK).json(sectors);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.SECTOR_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.addOrUpdateSector = async (req, res, next) => {
    try {
        const { name, value, date } = req.body;
        const sectorDate = new Date(date);
        sectorDate.setUTCHours(0, 0, 0, 0);
        const updatedSector = await Sector.findOneAndUpdate(
            { name, date: sectorDate },
            { name, value, date: sectorDate },
            { upsert: true, new: true, runValidators: true }
        );
        res.status(STATUS.OK).json({ message: MESSAGES.SECTOR_ADDED_UPDATED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.SECTOR_ERR_ADD_UPDATE, STATUS.BAD_REQUEST));
    }
};

exports.getSectorById = async (req, res, next) => {
    try {
        const sector = await Sector.findById(req.params.id);
        if (!sector) {
            return next(new ErrorHandler(MESSAGES.SECTOR_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json({ data: sector });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.SECTOR_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.deleteSector = async (req, res, next) => {
    try {
        const sector = await Sector.findByIdAndDelete(req.params.id);
        if (!sector) {
            return next(new ErrorHandler(MESSAGES.SECTOR_NOTFOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.OK).json({ message: MESSAGES.SECTOR_DELETED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.SECTOR_ERR_DELETE, STATUS.SERVER_ERROR));
    }
};

exports.updateSectorValues = async (req, res, next) => {
    try {
        const updates = req.body;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const updateOperations = updates.map(update => ({
            updateOne: {
                filter: { name: update.name, date: today },
                update: {
                    $set: {
                        name: update.name,
                        value: parseFloat(update.value),
                        date: today
                    }
                },
                upsert: true
            }
        }));
        if (updateOperations.length > 0) {
            await Sector.bulkWrite(updateOperations);
        }
        res.status(STATUS.OK).json({ message: MESSAGES.SECTORS_UPDATED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.SECTOR_ERR_UPDATE + ': ' + err.message, STATUS.SERVER_ERROR));
    }
};

exports.getSectorsForDate = async (req, res, next) => {
    try {
        const { date } = req.params;
        const queryDate = new Date(date);
        queryDate.setUTCHours(0, 0, 0, 0);

        const sectors = await Sector.find({ date: queryDate });
        res.status(STATUS.OK).json({ message: MESSAGES.SECTORS_FETCHED, data: sectors });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.SECTOR_ERR_FETCH_DATE, STATUS.SERVER_ERROR));
    }
};

exports.getLatestSectorValues = async (req, res, next) => {
    try {
        const latestSectors = await Sector.aggregate([
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: "$name",
                    latestDate: { $first: "$date" },
                    latestValue: { $first: "$value" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: "$latestValue",
                    date: "$latestDate"
                }
            }
        ]);
        res.status(STATUS.OK).json(latestSectors);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.SECTOR_ERR_FETCH_LATEST, STATUS.SERVER_ERROR));
    }
};
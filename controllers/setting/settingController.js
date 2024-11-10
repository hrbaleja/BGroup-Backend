const ErrorLog = require('../../models/settings/ErrorLog');
const MenuSetting = require('../../models/settings/MenuSettings')
const { STATUS, MESSAGES } = require('../../constants/setting');
const ErrorHandler = require('../../utils/errorHandler');


exports.fetchErrorLogs = async (req, res, next) => {
  try {
    const errorLogs = await ErrorLog.find().sort({ timestamp: -1 }).limit(10).populate('user', 'name');
    res.json(errorLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching error logs', error: error.message });
  }
};

exports.fetchMenuSettings = async (req, res, next) => {
  try {
    const menuSettings = await MenuSetting.find();
    res.status(STATUS.OK).json({
      message: MESSAGES.MENU_SETTINGS_FETCHED,
      data: menuSettings,
    });

  } catch (err) {
    next(new ErrorHandler(MESSAGES.MENU_SETTINGS_ERR_FETCH, STATUS.BAD_REQUEST));
  }
};


exports.addOrUpdateMenuSettings = async (req, res, next) => {
  try {
    const { menuItems } = req.body;
    const updatedBy = req.user.Id;

    const menuSettings = Object.entries(menuItems).map(([category, isVisible]) => ({
      category,
      isVisible,
      updatedBy,
      updatedAt: new Date()
    }));

    const updatedSettings = await MenuSetting.bulkWrite(
      menuSettings.map((setting) => ({
        updateOne: {
          filter: { category: setting.category },
          update: { $set: setting },
          upsert: true
        }
      }))
    );

    res.status(STATUS.OK).json({
      message: MESSAGES.MENU_SETTINGS_ADDED_UPDATED,
      menuSettings: updatedSettings.modifiedCount ? updatedSettings.upsertedIds : updatedSettings.upsertedValues
    });
  } catch (err) {
    next(new ErrorHandler(MESSAGES.MENU_SETTINGS_ERR_ADD_UPDATE, STATUS.BAD_REQUEST));
  }
};
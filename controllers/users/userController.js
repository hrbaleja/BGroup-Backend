const User = require('../../models/users/User');
const bcrypt = require('bcryptjs');
const errorHandler = require('../../utils/errorHandler');
const { STATUS, MESSAGES } = require('../../constants/users');

exports.getAllUsers = async (req, res, next) => {

    try {
        const { isDematUsers } = req;
        const role = req.user.role;
        if (role === 1 || role === 2) {
            let users;
            if (isDematUsers) {
                 users = await User.find({hasDematAccount: true}, '-password');
            } else {
                 users = await User.find({}, '-password');
            }
            res.status(STATUS.OK).json(users);
        } else {
            res.status(STATUS.FORBIDDEN).json({ error: MESSAGES.FORBIDDEN });
        }
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_FETCH_USERS, STATUS.BAD_REQUEST));
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { name, email, role,hasDematAccount } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.USER_NOT_FOUND });
        }

        await User.findByIdAndUpdate(userId, { name, email, role,hasDematAccount }, { new: true });
        res.status(STATUS.OK).json({ message: MESSAGES.USER_UPDATED });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_UPDATE_USER, STATUS.BAD_REQUEST));
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.USER_NOT_FOUND });
        }

        user.isActive = isActive;
        await user.save();
        res.status(STATUS.OK).json({ message: MESSAGES.USER_STATUS_UPDATED });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_UPDATE_STATUS, STATUS.BAD_REQUEST));
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.USER_NOT_FOUND });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();
        res.status(STATUS.OK).json({ message: MESSAGES.USER_PASSWORD_UPDATED });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_UPDATE_PASSWORD, STATUS.BAD_REQUEST));
    }
};
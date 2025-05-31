const User = require('../../models/users/User');
const bcrypt = require('bcryptjs');
const errorHandler = require('../../utils/errorHandler');
const { STATUS, MESSAGES } = require('../../constants/users');

exports.getAllUsers = async (req, res, next) => {

    try {
        const role = req.user.role;
        if (role === 1 || role === 2) {
            const users = await User.find({}, '-password').sort({ name: 1 });
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
        const { name, email, role, hasDematAccount } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.USER_NOT_FOUND });
        }

        await User.findByIdAndUpdate(userId, { name, email, role, hasDematAccount }, { new: true });
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

exports.getAllUsersPage = async (req, res, next) => {
    try {
        const role = req.user.role;
        if (role === 1 || role === 2) {
            const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', name, role: roleFilter, isVerified, isActive, hasDematAccount } = req.query;

            const query = {};
            if (name) query.name = { $regex: name, $options: 'i' };
            if (roleFilter) query.role = { $in: roleFilter.split(',').map(Number) };
            if (isVerified === 'true' || isVerified === 'false') {
                query.isVerified = isVerified === 'true';
            }

            if (isActive === 'true' || isActive === 'false') {
                query.isActive = isActive === 'true';
            }

            if (hasDematAccount === 'true' || hasDematAccount === 'false') {
                query.hasDematAccount = hasDematAccount === 'true';
            }

            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
                select: '-password'
            };

            const users = await User.paginate(query, options);
            res.status(STATUS.OK).json(users);
        } else {
            res.status(STATUS.FORBIDDEN).json({ error: MESSAGES.FORBIDDEN });
        }
    } catch (err) {
        next(new errorHandler(err, STATUS.BAD_REQUEST));
    }
};

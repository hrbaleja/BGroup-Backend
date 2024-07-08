const Credential = require('@models/users/Credential');
const errorHandler = require('../../utils/errorHandler');
const { STATUS, MESSAGES } = require('../../constants/users');

// Get all user credentials userWise user credential by ID
exports.getAllUserCredentials = async (req, res, next) => {
    try {
        const userId = req.user.Id;
        const userCredentials = await Credential.find({ user: userId }).populate('user', 'name');

        if (!userCredentials || userCredentials.length === 0) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.CREDENTIALS_NOT_FOUND });
        }
        res.status(STATUS.OK).json(userCredentials);
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_FETCH_CREDENTIALS, STATUS.BAD_REQUEST));
    }
};

// Create a new user credential
exports.createUserCredential = async (req, res, next) => {
    const { site, username, password, description } = req.body;
    const userCredential = new Credential({
        site,
        username,
        password,
        description,
        user: req.user.Id,
    });
    try {
        const newUserCredential = await userCredential.save();
        res.status(STATUS.CREATED).json({
            message: MESSAGES.CREDENTIAL_CREATED,
        });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_CREATE_CREDENTIAL, STATUS.BAD_REQUEST));
    }
};

// Update a user credential
exports.updateUserCredential = async (req, res, next) => {
    try {
        const updatedCredential = await Credential.findByIdAndUpdate(
            req.params.Id,
            req.body,
            { new: true }
        );
        if (!updatedCredential) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.CREDENTIALS_NOT_FOUND });
        }
        res.status(STATUS.OK).json({
            message: MESSAGES.CREDENTIAL_UPDATED,
            credential: updatedCredential
        });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_UPDATE_CREDENTIAL, STATUS.BAD_REQUEST));
    }
};

// Delete a user credential
exports.deleteUserCredential = async (req, res, next) => {
    try {
        const deletedCredential = await Credential.findByIdAndDelete(req.params.Id);
        if (!deletedCredential) {
            return res.status(STATUS.NOT_FOUND).json({ error: MESSAGES.CREDENTIALS_NOT_FOUND });
        }
        res.status(STATUS.OK).json({ message: MESSAGES.CREDENTIAL_DELETED });
    } catch (err) {
        next(new errorHandler(MESSAGES.ERROR_DELETE_CREDENTIAL, STATUS.BAD_REQUEST));
    }
};
const Task = require('../../models/overview/Task');
const { STATUS, MESSAGES } = require('../../constants/overview');
const ErrorHandler = require('../../utils/errorHandler');

exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.user.Id });
        res.status(STATUS.OK).json(tasks);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TASK_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.getTasksByStatus = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.user.Id, status: req.params.id });
        res.status(STATUS.OK).json(tasks);
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TASK_ERR_FETCH, STATUS.SERVER_ERROR));
    }
};

exports.createTask = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;
        const task = new Task({ title, description, status, userId: req.user.Id });
        await task.save();
        res.status(STATUS.CREATED).json({ message: MESSAGES.TASK_CREATED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TASK_ERR_CREATE, STATUS.BAD_REQUEST));
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.Id },
            { title, description, status },
            { new: true }
        );

        if (!task) {
            return next(new ErrorHandler(MESSAGES.TASK_NOTFOUND, STATUS.NOT_FOUND));
        }

        res.status(STATUS.OK).json({ message: MESSAGES.TASK_UPDATED, data: task });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TASK_ERR_UPDATE, STATUS.BAD_REQUEST));
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.Id,
        });

        if (!task) {
            return next(new ErrorHandler(MESSAGES.TASK_NOTFOUND, STATUS.NOT_FOUND));
        }

        res.status(STATUS.OK).json({ message: MESSAGES.TASK_DELETED });
    } catch (err) {
        next(new ErrorHandler(MESSAGES.TASK_ERR_DELETE, STATUS.SERVER_ERROR));
    }
};
const Information = require('../models/Information');

// Create a new financial information entry
exports.createEntry = async (req, res) => {
    try {
        const userId = req.user._id;
        const entry = req.body;
        const information = await Information.findOneAndUpdate(
            { user: userId },
            { $push: { entries: entry } },
            { new: true, upsert: true }
        );
        res.status(201).json(information);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get financial information entries for the current user
exports.getEntries = async (req, res) => {

    try {
        const userId = req.user._id;
        const information = await Information.findOne({ user: userId });
        if (!information) {
            return res.status(404).json({ error: 'Financial information not found' });
        }
        res.json(information.entries);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const userId = req.user._id;
        const entryId = req.params.entryId;
        const updatedEntry = req.body;
        const information = await FinancialInformation.findOneAndUpdate(
            { user: userId, 'entries._id': entryId },
            { $set: { 'entries.$': updatedEntry } },
            { new: true }
        );
        if (!information) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.json(information);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete an existing financial information entry
exports.deleteEntry = async (req, res) => {
    try {
        const userId = req.user._id;
        const entryId = req.params.entryId;
        const information = await Information.findOneAndUpdate(
            { user: userId },
            { $pull: { entries: { _id: entryId } } },
            { new: true }
        );
        if (!information) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.json(information);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
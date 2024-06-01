const express = require('express');
const router = express.Router();
const InformationController = require('../controllers/innformationController');
const { protect } = require('../middleware/auth');

// Create a new financial information entry
router.post('/',protect,  InformationController.createEntry);

// Get financial information entries for the current user
router.get('/', protect, InformationController.getEntries);

// Update an existing financial information entry
router.put('/:entryId', protect, InformationController.updateEntry);

// Delete an existing financial information entry
router.delete('/:entryId', protect, InformationController.deleteEntry);

module.exports = router;
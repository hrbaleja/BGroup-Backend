const express = require('express');
const router = express.Router();
const profileController = require('../controllers/ProfileController');
const { protect } = require('../middleware/auth');

// Create a new profile
router.post('/',protect, profileController.createProfile);

// Get a profile by ID
router.get('/:id',protect, profileController.getProfileById);

// Update a profile
router.put('/:id',protect, profileController.updateProfile);

// Delete a profile
router.delete('/:id',protect, profileController.deleteProfile);

module.exports = router;
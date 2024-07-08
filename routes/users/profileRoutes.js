const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/users/profileController');

// Create a new profile
router.post('/', profileController.createProfile);

// Get a profile by ID
router.get('/:id',profileController.getProfileById);

// Update a profile
router.put('/:id', profileController.updateProfile);

// Delete a profile
router.delete('/:id', profileController.deleteProfile);

module.exports = router;
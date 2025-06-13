const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/users/contactController');

// Get all contacts for the logged-in user
router.get('/', contactController.getAllUserContacts);

// Create a new contact
router.post('/', contactController.createUserContact);

// Update an existing contact by ID
router.put('/:Id', contactController.updateUserContact);

// Delete a contact by ID
router.delete('/:Id', contactController.deleteUserContact);

module.exports = router;

const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/sectorContoller');



// Get all sectors
router.get('/', sectorController.getAllSectors);

// Create a new sector
router.post('/', sectorController.createSector);

// Get a sector by ID
router.get('/:id', sectorController.getSectorById);

// Update a sector
router.put('/:id', sectorController.updateSector);

// Delete a sector
router.delete('/:id', sectorController.deleteSector);

module.exports = router;

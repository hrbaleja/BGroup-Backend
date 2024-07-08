const express = require('express');
const router = express.Router();
const sectorController = require('../../controllers/overview/sectorContoller');

router.get('/', sectorController.getAllSectors);
router.post('/', sectorController.addOrUpdateSector);

router.get('/date/:date', sectorController.getSectorsForDate);
 router.get('/latest', sectorController.getLatestSectorValues);
router.get('/:id', sectorController.getSectorById);
router.put('/:id', sectorController.addOrUpdateSector);
router.delete('/:id', sectorController.deleteSector);
router.post('/update', sectorController.updateSectorValues);

module.exports = router;
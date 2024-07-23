const express = require('express');
const router = express.Router();
const SectorController = require('../../controllers/overview/sectorContoller');

router.get('/', SectorController.getAllSectors);
router.post('/', SectorController.addOrUpdateSector);

router.get('/date/:date', SectorController.getSectorsForDate);
 router.get('/latest', SectorController.getLatestSectorValues);
router.get('/:id', SectorController.getSectorById);
router.put('/:id', SectorController.addOrUpdateSector);
router.delete('/:id', SectorController.deleteSector);
router.post('/update', SectorController.updateSectorValues);

module.exports = router;
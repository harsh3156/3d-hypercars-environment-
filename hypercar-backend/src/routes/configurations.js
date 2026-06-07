const express = require('express');
const router = express.Router();
const {
  createConfiguration,
  getConfiguration,
  updateConfiguration,
  submitConfiguration,
  getPriceSummary,
  getAllConfigurations,
} = require('../controllers/configurationController');

router.get('/', getAllConfigurations);
router.post('/', createConfiguration);
router.post('/price-summary', getPriceSummary);
router.get('/:configId', getConfiguration);
router.put('/:configId', updateConfiguration);
router.post('/:configId/submit', submitConfiguration);

module.exports = router;

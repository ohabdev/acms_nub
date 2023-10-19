const CityRateController = require('../controllers/CityRateController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth('public'), CityRateController.getAllCityRates);
router.get('/:id', auth(), CityRateController.getSingleCityRate);
router.put('/:id', auth(), CityRateController.update);
router.delete('/:id', auth(), CityRateController.delete);
router.post('/create', auth(), CityRateController.create);
router.delete('/hard-delete/:id', auth(), CityRateController.hardDelete);

module.exports = router;

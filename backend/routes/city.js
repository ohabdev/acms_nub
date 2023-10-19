const CityController = require('../controllers/CityController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth('public'), CityController.getAllCities);
router.get('/:id', auth(), CityController.getSingleCity);
router.put('/:id', auth(), CityController.update);
router.delete('/:id', auth(), CityController.delete);
router.post('/create', auth(), CityController.create);
router.delete('/hard-delete/:id', auth(), CityController.hardDelete);

module.exports = router;

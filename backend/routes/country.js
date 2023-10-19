const CountryController = require('../controllers/CountryController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth('public'), CountryController.getAllCountries);
router.get('/:id', auth(), CountryController.getSingleCountry);
router.put('/:id', auth(), CountryController.update);
router.delete('/:id', auth(), CountryController.delete);
router.post('/create', auth(), CountryController.create);
router.delete('/hard-delete/:id', auth(), CountryController.hardDelete);

module.exports = router;

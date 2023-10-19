const CountyController = require('../controllers/CountyController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth('public'), CountyController.getAllCounties);
router.get('/:id', auth(), CountyController.getSingleCounty);
router.put('/:id', auth(), CountyController.update);
router.delete('/:id', auth(), CountyController.delete);
router.post('/create', auth(), CountyController.create);
router.delete('/hard-delete/:id', auth(), CountyController.hardDelete);

module.exports = router;

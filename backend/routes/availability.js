const AvailabilityController = require('../controllers/AvailabilityController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth(), AvailabilityController.getAllAvailabilities);
router.get('/:id', auth(), AvailabilityController.getSingleAvailability);
router.put('/:id', auth(), AvailabilityController.update);
router.delete('/:id', auth(), AvailabilityController.delete);
router.post('/create', auth(), AvailabilityController.create);

module.exports = router;

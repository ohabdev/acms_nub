const ServiceTypeController = require('../controllers/ServiceTypeController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth('public'), ServiceTypeController.getAllServiceTypes);
router.get('/sub-serviceTypes/', auth('public'), ServiceTypeController.getAllSubServiceTypes);
router.get('/sub-serviceTypes/:id', auth('public'), ServiceTypeController.getAllSubServiceTypesById);
router.get('/:id', auth('public'), ServiceTypeController.getSingleServiceType);
router.put('/:id', auth(), ServiceTypeController.update);
router.delete('/:id', auth(), ServiceTypeController.delete);
router.post('/create', auth(), ServiceTypeController.create);
router.delete('/hard-delete/:id', auth(), ServiceTypeController.hardDelete);

module.exports = router;

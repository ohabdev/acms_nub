const ServiceController = require('../controllers/ServiceController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth('public'), ServiceController.getAllServices);
router.get('/my-services', auth(), ServiceController.myServices);
router.get('/provider-services/:id', auth('public'), ServiceController.providerServices);
router.get('/sub-services/', auth('public'), ServiceController.getAllSubServices);
router.get('/sub-services/:id', auth('public'), ServiceController.getAllSubServicesById);
router.get('/search', auth('public'), ServiceController.searchServices);
router.get('/:id', auth('public'), ServiceController.getSingleService);
router.put('/:id', auth(), ServiceController.update);
router.delete('/:id', auth(), ServiceController.delete);
router.post('/create/', auth(), ServiceController.create);

module.exports = router;

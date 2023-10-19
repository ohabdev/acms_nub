const OrderController = require('../controllers/OrderController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.post('/create', auth(), OrderController.create);
router.get('/', auth(), OrderController.getAllOrders);
router.get('/provider', auth(), OrderController.providerOrders);
router.get('/client', auth(), OrderController.clientOrders);
router.get('/:id', auth(), OrderController.getSingleOrder);
router.put('/:id', auth(), OrderController.update);
router.delete('/:id', auth(), OrderController.delete);
router.delete('/hard-delete/:id', auth(), OrderController.hardDelete);

module.exports = router;

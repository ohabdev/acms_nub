const InvoiceController = require('../controllers/InvoiceController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.post('/create', auth(), InvoiceController.create);
router.get('/', auth(), InvoiceController.getAllInvoices);
router.get('/:id', auth(), InvoiceController.getSingleInvoice);
router.put('/:id', auth(), InvoiceController.update);
router.delete('/:id', auth(), InvoiceController.delete);

module.exports = router;

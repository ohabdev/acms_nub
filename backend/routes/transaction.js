const TransactionController = require('../controllers/TransactionController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.post('/create', auth(), TransactionController.create);
router.get('/', auth(), TransactionController.getAllTransactions);
router.get('/:id', auth(), TransactionController.getSingleTransaction);
router.put('/:id', auth(), TransactionController.update);
router.delete('/:id', auth(), TransactionController.delete);

module.exports = router;

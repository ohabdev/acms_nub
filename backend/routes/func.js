const FunctionController = require('../controllers/FunctionController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth(), FunctionController.getAllFunctions);
router.get('/:id', auth(), FunctionController.getFunctionById);
router.put('/:id', auth(), FunctionController.update);
router.delete('/:id', auth(), FunctionController.delete);
router.post('/create', auth(), FunctionController.create);
router.delete('/hard-delete/:id', auth(), FunctionController.hardDelete);

module.exports = router;

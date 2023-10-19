const StateController = require('../controllers/StateController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth('public'), StateController.getAllStates);
router.get('/:id', auth(), StateController.getSingleState);
router.put('/:id', auth(), StateController.update);
router.delete('/:id', auth(), StateController.delete);
router.post('/create', auth(), StateController.create);
router.delete('/hard-delete/:id', auth(), StateController.hardDelete);

module.exports = router;

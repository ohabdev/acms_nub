const CategoryController = require('../controllers/CategoryController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth(), CategoryController.getAllCategories);
router.get('/:id', auth(), CategoryController.getSingleCategory);
router.put('/:id', auth(), CategoryController.update);
router.delete('/:id', auth(), CategoryController.delete);
router.post('/create/', auth(), CategoryController.create);
router.delete('/hard-delete/:id', auth(), CategoryController.hardDelete);

module.exports = router;

const ReviewController = require('../controllers/ReviewController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.post('/create', auth(), ReviewController.create);
router.get('/', auth(), ReviewController.getAllReviews);
router.get('/:id', auth(), ReviewController.getSingleReview);
router.put('/:id', auth(), ReviewController.update);
router.delete('/:id', auth(), ReviewController.delete);

module.exports = router;

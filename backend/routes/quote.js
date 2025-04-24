const QuoteController = require('../controllers/QuoteController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.post('/create', auth(), QuoteController.create);

module.exports = router;

const MessageController = require('../controllers/MessageController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.post('/create', auth(), MessageController.create);

module.exports = router;

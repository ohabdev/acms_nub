const ConversationController = require('../controllers/ConversationController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth(), ConversationController.getAllConversations);
router.post('/create', auth(), ConversationController.create);
router.get('/get-all-messages-by-conversion/:id', auth(), ConversationController.getAllMessagesByConversion);

module.exports = router;

const NotificationController = require('../controllers/NotificationController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', auth(), NotificationController.getAllNotifications);

module.exports = router;

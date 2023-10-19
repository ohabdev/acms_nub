const { Notification, Provider, Client } = require('../models');
const { Constant } = require('../constants');
const userSockets = require('./userSockets');
const logger = require('../helpers/logger');

// Send notification to a provider
const sendNotificationToProvider = async (req, message) => {
	try {
		// Find the provider information
		const providerInfo = await Provider.findByPk(req?.body?.providerId);

		// Create a notification record
		const notification = {
			fromUserId: req.user.id,
			toUserId: providerInfo?.userId,
			entityId: req?.body?.orderId,
			notificationType: 'Order',
			notificationMessage: message
		};
		Notification.create(notification);

		// Get the provider's socket
		const userSocket = userSockets.getUserSocket(providerInfo?.userId);
		if (userSocket) {
			// Emit the notification to the user's socket
			userSocket.emit(Constant.providerOrderNotification, { message, notification });
			logger.info(`Notification sent to provider: ${providerInfo?.userId}`);
		} else {
			logger.error(`Users socket not found for user ID: ${req.body.toUserId}`);
		}
	} catch (e) {
		logger.error(`Error sending notification to provider: ${e.message}`);
	}
};

// Send notification to a client
const sendNotificationToClient = async (req, message) => {
	try {
		// Find the client information
		const clientInfo = await Client.findByPk(req?.body?.clientId);

		// Create a notification record
		const notification = {
			fromUserId: req.user.id,
			toUserId: clientInfo?.userId,
			entityId: req?.body?.orderId,
			notificationType: 'Order',
			notificationMessage: message
		};
		Notification.create(notification);

		// Get the client's socket
		const userSocket = userSockets.getUserSocket(clientInfo?.userId);
		if (userSocket) {
			// Emit the notification to the user's socket
			userSocket.emit(Constant.clientOrderNotification, { message, notification });
			logger.info(`Notification sent to client: ${clientInfo?.userId}`);
		} else {
			logger.error(`User socket not found for user ID: ${req.body.toUserId}`);
		}
	} catch (e) {
		logger.error(`Error sending notification to client: ${e.message}`);
	}
};

// Send notification to system users
const sendNotificationToSystemUsers = async (req, message) => {
	try {
		// Create a notification record
		const notification = {
			fromUserId: req.user.id,
			entityId: req?.body?.orderId,
			notificationType: 'Order',
			notificationMessage: message
		};
		Notification.create(notification);

		// Emit the notification to all connected clients
		req.io.emit(`${Constant.systemUsersOrderNotification}`, message);
		logger.info(`Notification sent to system users.`);
	} catch (e) {
		logger.error(`Error sending notification to system users: ${e.message}`);
	}
};

// Sending new user sign up notification to system users
const sendSignUpNotificationToSystemUsers = async (data, message) => {
	try {
		const { req, user } = data;

		// Create a notification record
		const notification = {
			fromUserId: user.id,
			entityId: user.id,
			notificationType: 'SignUp',
			notificationMessage: message
		};
		Notification.create(notification);

		// Emit the sign-up notification to all connected clients
		req.io.emit(`${Constant.systemUsersSignUpNotification}`, message);
		logger.info(`Sign up notification sent to system users.`);
	} catch (e) {
		logger.error(`Error sending Sign up notification to system users: ${e.message}`);
	}
};

// Sending user profile type update notification to system users
const sendUserTypeUpdateNotificationToSystemUsers = async (req, message) => {
	try {
		// Create a notification record
		const notification = {
			fromUserId: req.user.id,
			entityId: req.user.id,
			notificationType: 'UserTypeUpdate',
			notificationMessage: message
		};
		Notification.create(notification);

		// Emit the user type update notification to all connected clients
		req.io.emit(`${Constant.systemUsersUserTypeUpdateNotification}`, message);
		logger.info(`User type update notification sent to system users.`);
	} catch (e) {
		logger.error(`Error sending user type update notification to system users: ${e.message}`);
	}
};

module.exports = {
	sendNotificationToProvider,
	sendNotificationToClient,
	sendNotificationToSystemUsers,
	sendSignUpNotificationToSystemUsers,
	sendUserTypeUpdateNotificationToSystemUsers
};

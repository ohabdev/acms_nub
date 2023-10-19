const { Notification, User } = require('../models'); // Assuming your models are in the 'models' folder
const apiResponse = require('../helpers/apiResponse');
const path = require('path');
const fileName = path.basename(__filename);
const logger = require('../helpers/logger'); // Import your logger here

// Create a new notification
exports.createNotification = async (req, res) => {
	const name = 'createNotification';
	try {
		// Assuming you have the necessary data in req.body
		const notification = await Notification.create(req.body);
		// You can also populate fromUser and toUser if needed
		await notification.reload({
			include: [
				{ model: User, as: 'fromUser' },
				{ model: User, as: 'toUser' }
			]
		});

		logger.info(`${fileName}->${name} Notification successfully created: ${JSON.stringify(notification)}`);
		
		return apiResponse.successResponseWithData(res, 'Notification successfully created', notification);
	} catch (err) {
		logger.error(`${fileName}->${name} Error creating notification: ${err.message}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a single notification by ID
exports.getNotificationById = async (req, res) => {
	const name = 'getNotificationById';
	try {
		const notification = await Notification.findByPk(req.params.id);
		if (!notification) {
			throw new Error('Notification not found');
		} else {
			logger.info(`${fileName}->${name} Notification successfully fetched: ${JSON.stringify(notification)}`);
			return apiResponse.successResponseWithData(res, 'Notification successfully fetched', notification);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Error fetching notification: ${err.message}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update a notification by ID (mark it as read, for example)
exports.updateNotification = async (req, res) => {
	const name = 'updateNotification';
	try {
		const notification = await Notification.findByPk(req.params.id);
		if (!notification) {
			throw new Error('Notification not found');
		} else {
			// Assuming you have the necessary data in req.body for the update
			await notification.update(req.body);

			logger.info(`${fileName}->${name} Notification successfully updated: ${JSON.stringify(notification)}`);
			
			return apiResponse.successResponseWithData(res, 'Notification successfully updated', notification);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Error updating notification: ${err.message}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
	const name = 'deleteNotification';
	try {
		const notification = await Notification.findByPk(req.params.id);
		if (!notification) {
			throw new Error('Notification not found');
		} else {
			await notification.destroy();

			logger.info(`${fileName}->${name} Notification successfully deleted: ${JSON.stringify(notification)}`);
			
			return apiResponse.successResponse(res, 'Notification successfully deleted');
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Error deleting notification: ${err.message}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all notifications with pagination
exports.getAllNotifications = async (req, res) => {
	const name = 'getAllNotifications';
	try {
		const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not specified
		const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page, default to 10 if not specified

		const offset = (page - 1) * pageSize; // Calculate offset based on page and pageSize

		const { count, rows } = await Notification.findAndCountAll({
			limit: pageSize,
			offset: offset,
			order: [['id', 'DESC']] // You can change the sorting as needed
		});

		const totalPages = Math.ceil(count / pageSize);

		const response = {
			page: page,
			pageSize: pageSize,
			totalPages: totalPages,
			totalItems: count,
			notifications: rows
		};

		logger.info(`${fileName}->${name} Paginated notifications successfully fetched: ${JSON.stringify(response)}`);
		return apiResponse.successResponseWithData(res, 'Paginated notifications successfully fetched', response);
	} catch (err) {
		logger.error(`${fileName}->${name} Error fetching paginated notifications: ${err.message}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};


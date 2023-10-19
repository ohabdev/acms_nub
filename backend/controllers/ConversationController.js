const { Conversation, Service, User, Message } = require('../models'); // Assuming your models are in the 'models' folder
const apiResponse = require('../helpers/apiResponse');
const path = require('path');
const { Op } = require('sequelize');
const { createNewChatRoom } = require('../ws/conversions');
const { createConversationSchema } = require('../validators/conversation'); // You should create a validator for the conversation model
const fileName = path.basename(__filename);
const logger = require('../helpers/logger');

// Create a new conversation
exports.create = async (req, res) => {
	const name = 'createConversation';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		req.body.fromUserId = req?.user?.id;
		const { error } = createConversationSchema.validate(req.body);
		if (error) {
			throw new Error(error);
		}
		const checking = await Conversation.findOne({
			where: {
				fromUserId: req?.user?.id,
				toUserId: req.body.toUserId
			},
			include: [
				{
					model: Message,
					as: 'lastMessage',
					required: false
				},
				{
					model: User,
					as: 'fromUser'
				},
				{
					model: User,
					as: 'toUser'
				}
			]
		});
		if (checking) {
			logger.info(`${fileName}->${name} Conversation successfully created and return object ${JSON.stringify(checking)}`);
			return apiResponse.successResponseWithData(res, 'Conversation successfully created', checking);
		}
		const conversation = await Conversation.create(req.body);
		await conversation.reload({
			include: [
				{
					model: Message,
					as: 'lastMessage',
					required: false
				},
				{
					model: User,
					as: 'fromUser'
				},
				{
					model: User,
					as: 'toUser'
				}
			]
		});
		logger.info(`${fileName}->${name} Conversation successfully created and return object ${JSON.stringify(conversation)}`);
		createNewChatRoom(req, conversation);
		return apiResponse.successResponseWithData(res, 'Conversation successfully created', conversation);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Conversation successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all getAllMessagesByConversion
exports.getAllMessagesByConversion = async (req, res) => {
	const name = 'getAllMessagesByConversion';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit = ${limit} and offset = ${offset} for fetching data from the database`);
		const conversations = await Message.findAndCountAll({
			where: {
				conversationId: req.params.id
			},
			limit,
			offset,
			order: [['id', 'DESC']],
			include: [
				{ model: User, as: 'fromUser' },
				{ model: User, as: 'toUser' }
			]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(conversations)}`);

		return apiResponse.successResponseWithData(res, 'Conversations successfully fetched', conversations);
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get all conversations
exports.getAllConversations = async (req, res) => {
	const name = 'getAllConversations';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit = ${limit} and offset = ${offset} for fetching data from the database`);

		const conversations = await Conversation.findAndCountAll({
			where: {
				isDeleted: false,
				[Op.or]: [{ fromUserId: req.user.id }, { toUserId: req.user.id }]
			},
			limit,
			offset,
			order: [['id', 'DESC']],
			include: [
				{ model: Service, as: 'service' },
				{ model: User, as: 'fromUser' },
				{ model: User, as: 'toUser' },
				{ model: Message, as: 'lastMessage' }
			]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(conversations)}`);
		return apiResponse.successResponseWithData(res, 'Conversations successfully fetched', conversations);
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single conversation by ID
exports.getSingleConversation = async (req, res) => {
	const name = 'getSingleConversation';
	try {
		const conversation = await Conversation.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			},
			include: [
				{ model: Service, as: 'service' },
				{ model: User, as: 'fromUser' },
				{ model: User, as: 'toUser' },
				{ model: Message, as: 'lastMessage' }
			]
		});
		if (!conversation) {
			throw new Error('Conversation not found');
		} else {
			logger.info(`${fileName}->${name} Conversation successfully fetched for ${req.params.id} this ID data=${JSON.stringify(conversation)}`);
			return apiResponse.successResponseWithData(res, 'Conversation successfully fetched', conversation);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a conversation by ID
exports.update = async (req, res) => {
	const name = 'updateConversation';
	try {
		const conversation = await Conversation.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!conversation) {
			throw new Error('Conversation not found');
		} else {
			req.body.updatedBy = req?.user?.id;
			await conversation.update(req.body);
			logger.info(`${fileName}->${name} Conversation successfully updated and return object ${JSON.stringify(conversation)}`);
			return apiResponse.successResponseWithData(res, 'Conversation successfully updated', conversation);
		}
	} catch (err) {
		if (err?.errors?.length > 0 && err?.errors[0]?.message) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Conversation successfully not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a conversation by ID
exports.delete = async (req, res) => {
	const name = 'deleteConversation';
	try {
		const conversation = await Conversation.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!conversation) {
			throw new Error('Conversation not found');
		} else {
			await conversation.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} Conversation successfully deleted and return object ${JSON.stringify(conversation)}`);
			return apiResponse.successResponseWithData(res, 'Conversation successfully deleted', conversation);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Conversation successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

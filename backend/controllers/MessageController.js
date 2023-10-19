const { Message, Conversation, User } = require('../models'); // Import your Sequelize models
const apiResponse = require('../helpers/apiResponse');
const path = require('path');
const { createMessageSchema } = require('../validators/message'); // Create a message validation schema
const fileName = path.basename(__filename);
const logger = require('../helpers/logger');
const { sendToChatRoom } = require('../ws/messages');

// Create a new message
exports.create = async (req, res) => {
	const name = 'createMessage';
	try {
		logger.info(`${fileName}->${name} Received message data from client: ${JSON.stringify(req.body)}`);

		// Assuming you have a conversation ID associated with the message
		const conversationId = req.body.conversationId;

		// Check if the conversation exists
		const conversation = await Conversation.findByPk(conversationId);
		if (!conversation) {
			throw new Error('Conversation not found');
		}
		// Add the current user ID to the message
		req.body.fromUserId = req?.user?.id;
		if (conversation.fromUserId == req.user.id || conversation.toUserId == req.user.id) {
			if (conversation.fromUserId == req.user.id) {
				req.body.toUserId = conversation.toUserId;
			}
			if (conversation.toUserId == req.user.id) {
				req.body.toUserId = conversation.fromUserId;
			}
			// Validate the message data
			const { error } = createMessageSchema.validate(req.body);
			if (error) {
				throw new Error(error.details[0].message);
			}
			// Create a new message
			const message = await Message.create(req.body);
			// update last message id in conversion table
			await conversation.update({
				lastMessageId: message.id
			});
			await conversation.reload({
				include: [
					{ model: Message, as: 'lastMessage' },
					{ model: User, as: 'fromUser' },
					{ model: User, as: 'toUser' }
				]
			});
			sendToChatRoom(req, conversation);
			logger.info(`${fileName}->${name} Message successfully created: ${JSON.stringify(conversation)}`);
			return apiResponse.successResponseWithData(res, 'Message successfully created', conversation);
		} else {
			throw new Error('Conversion id is not valid');
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Message creation failed: ${err.message}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get messages in a conversation
exports.getConversationMessages = async (req, res) => {
	const name = 'getConversationMessages';
	try {
		const { conversationId } = req.params;

		logger.info(`${fileName}->${name} Fetching messages for conversation ID: ${conversationId}`);

		// Fetch messages for the conversation
		const messages = await Message.findAll({
			where: {
				conversationId,
				isDeletedByFromUser: false, // Adjust based on your requirements
				isDeletedByToUser: false // Adjust based on your requirements
			},
			include: [
				{ model: User, as: 'fromUser' },
				{ model: User, as: 'toUser' }
			],
			order: [['createdAt', 'DESC']] // Order messages by creation date
		});

		logger.info(`${fileName}->${name} Messages fetched successfully: ${JSON.stringify(messages)}`);
		return apiResponse.successResponseWithData(res, 'Messages fetched successfully', messages);
	} catch (error) {
		logger.error(`${fileName}->${name} Failed to fetch messages: ${error.message}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Additional controller functions for updating and deleting messages can be added similarly

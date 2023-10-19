const { Constant } = require('../constants');
const logger = require('../helpers/logger');
const userSockets = require('./userSockets');

// Send a chat message to a specific user
const sendToChatRoom = async (req, data) => {
	try {
		// Get the user's socket based on the provided user ID
		const userSocket = userSockets.getUserSocket(req.body.toUserId);

		if (userSocket) {
			// Emit the message to the user's socket in the chat room
			userSocket.emit(Constant.chatRoom, data);
		} else {
			// Log an error if the user's socket is not found
			logger.error(`User socket not found for user ID: ${req.body.toUserId}`);
		}
	} catch (e) {
		// Log an error if there is any issue sending the message
		logger.error(`Error sending chat message to user: ${e.message}`);
	}
};

module.exports = {
	sendToChatRoom
};

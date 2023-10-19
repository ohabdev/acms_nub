const { Constant } = require('../constants');
const logger = require('../helpers/logger');
const userSockets = require('./userSockets');

// Create a new chat room and send data to a specific user
const createNewChatRoom = async (req, data) => {
	try {
		// Get the user's socket based on the provided user ID
		const userSocket = userSockets.getUserSocket(req.body.toUserId);

		if (userSocket) {
			// Emit the data to the user's socket in the chat room
			req.io.to(userSocket).emit(Constant.chatRoom, data);
		} else {
			// Log an error if the user's socket is not found
			logger.error(`User socket not found for user ID: ${req.body.toUserId}`);
		}
	} catch (e) {
		// Log an error if there is any issue sending the data
		logger.error(`Error sending data to client: ${e.message}`);
	}
};

module.exports = {
	createNewChatRoom
};

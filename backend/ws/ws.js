const { error } = require('winston');
const wsAuthenticate = require('../middleware/socketAuthMiddleware');
const userSockets = require('./userSockets');
// const { message } = require('./messages'); // You can uncomment this line if needed
const logger = require('../helpers/logger');

module.exports = (io) => {
	io.on('connection', async (socket) => {
		const token = socket.handshake?.headers?.authorization; // Assuming the token is passed as a query parameter
		try {
			const response = await wsAuthenticate(token);
			if (!response?.id) {
				// Authentication failed
				socket.emit('authFailed', 'Authentication failed');
				socket.disconnect(true); // Disconnect the client with an error
				return; // Stop further execution
			}

			// Store the user's socket
			userSockets.setUserSocket(response?.id, socket);

			// You can add your message handling logic here if needed
			// message(socket, io);

			socket.on('disconnect', () => {
				// Remove the user's socket when they disconnect
				userSockets.removeUserSocket(response?.id);
				logger.info('A user disconnected'); // Log user disconnection
			});
		} catch (err) {
			// Handle any errors from wsAuthenticate
			logger.error('Authentication error:', err.message);
			socket.emit('authFailed', 'Authentication failed');
			socket.disconnect(true); // Disconnect the client with an error
		}
	});
};

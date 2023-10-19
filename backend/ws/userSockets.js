// userSockets.js

// Create a Map to store user sockets, where the key is the userId and the value is the socket
const userSockets = new Map();

// Function to set (add) a user's socket to the Map
function setUserSocket(userId, socket) {
	userSockets.set(userId, socket);
}

// Function to remove a user's socket from the Map
function removeUserSocket(userId) {
	userSockets.delete(userId);
}

// Function to get a user's socket from the Map
function getUserSocket(userId) {
	return userSockets.get(userId);
}

module.exports = {
	setUserSocket,
	removeUserSocket,
	getUserSocket
};

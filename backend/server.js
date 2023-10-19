require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const model = require('./models');
const cors = require('cors');
const path = require('path');

const morganMiddleware = require('./middleware/morgan');
const wsConfig = require('./ws/ws');
const { normalizePort } = require('./helpers/utility');
const apiResponse = require('./helpers/apiResponse');
const logger = require('./helpers/logger');
const apiRouter = require('./routes/api');
const port = normalizePort(process.env.PORT || '8081');

const app = express();

const configPath = {
	publicPath: path.resolve('./public')
};

app.use(morganMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(configPath.publicPath));

// Define the allowed origins as an array
const corsOptions = {
	origin: ['http://localhost:3000', 'http://localhost:3002', process.env.SITE_BASE_URL, process.env.ADMIN_BASE_URL]
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// add multer middleware
app.disable('x-powered-by');

// Middleware to attach 'io' to the 'req' object
const attachIoMiddleware = (req, res, next) => {
	req.io = io; // Attach the 'io' object to the 'req' object
	next();
};

//Route Prefixes
app.use('/', attachIoMiddleware, apiRouter);

model.sequelize.authenticate();
// throw 404 if URL not found
app.all('*', function (req, res) {
	logger.info(`Page not found`);
	return apiResponse.notFoundResponse(res, 'Page not found');
});

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);

// Initialize Socket.IO with a custom path
const io = socketIo(server);
// Initialize the socket.io logic module with the 'io' object
wsConfig(io);
// Handle unhandled exceptions to prevent application crashes
process.on('uncaughtException', () => {
	// Gracefully exit the application
	server.close(() => {
		process.exit(1);
	});
});
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Handle or log the rejection here
});

server.listen(port, () => {
	logger.info(`Server started on : http://localhost:${port}`);
});

module.exports = server;

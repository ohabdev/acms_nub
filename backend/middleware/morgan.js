const morgan = require('morgan');
const logger = require('../helpers/logger');

const stream = { write: (message) => logger.http(message.trim()) };

const skip = () => {
	const env = process.env.NODE_ENV || 'development';
	return env !== 'development';
};

const format = ':remote-addr :method :url :status :res[content-length] - :response-time ms';

//! Define color mappings for HTTP verbs and other log parts
const colorizeLogParts = (message) =>
	message
		.replace(/:method/g, '\x1b[36m:method\x1b[0m') // Cyan
		.replace(/:url/g, '\x1b[35m:url\x1b[0m') // Magenta
		.replace(/:status/g, '\x1b[32m:status\x1b[0m') // Green
		.replace(/:res\[content-length]/g, '\x1b[33m:res[content-length]\x1b[0m') // Yellow
		.replace(/:response-time/g, '\x1b[31m:response-time\x1b[0m'); // Red

const morganMiddleware = morgan(
	(tokens, req, res) => {
		const colorizedMessage = colorizeLogParts(format);
		return morgan.compile(colorizedMessage)(tokens, req, res);
	},
	{ stream, skip }
);

module.exports = morganMiddleware;

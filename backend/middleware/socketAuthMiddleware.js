const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const logger = require('../helpers/logger');
const { User } = require('../models');
const path = require('path');
const fileName = path.basename(__filename);

const wsAuthenticate = (authHeader) => {
	const name = 'wsAuthenticate';
	try {
		if (authHeader) {
			const token = authHeader.split(' ')[1];
			return jwt.verify(token, secret, async (err, user) => {
				if (err) {
					logger.error(`${fileName}->${name} Token verification failed: ${err.message}`);
					throw new Error('Your token is invalid. Please make sure you have a valid auth token.');
				}
				const userInfo = await User.findOne({
					where: {
						id: user?.id
					}
				});
				if (!userInfo) {
					logger.error(`${fileName}->${name} User not found for the provided token.`);
					throw new Error('Your token is invalid. Please make sure you have a valid auth token.');
				}
				user.userInfo = userInfo;
				logger.info(`${fileName}->${name} User authenticated successfully: ${userInfo.id}`);
				return user;
			});
		} else {
			logger.error(`${fileName}->${name} Authorization header is missing.`);
			throw new Error('You are not authorized.');
		}
	} catch (e) {
		logger.error(`${fileName}->${name} Authentication error: ${e.message}`);
		return e;
	}
};

module.exports = wsAuthenticate;

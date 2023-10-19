const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const apiResponse = require('../helpers/apiResponse');
const logger = require('../helpers/logger');
const { User, Role, Permission, Function } = require('../models');
const path = require('path');
const fileName = path.basename(__filename);
const authenticate = (roles = []) => {
	const name = 'authenticate';
	// if (typeof roles === 'string') {
	// 	roles = [roles];
	// }
	logger.info(`${fileName}->${name} function route role ${roles} `);
	return (req, res, next) => {
		if (roles === 'public') {
			return next();
		}
		const authHeader = req.headers.authorization;
		if (authHeader) {
			const token = authHeader.split(' ')[1];
			return jwt.verify(token, secret, async (err, user) => {
				if (err) {
					return apiResponse.unauthorizedResponse(res, 'Your token is invalid. Please make sure you have a valid auth token.');
				}
				// const actualPath = req?.baseUrl + req?.route?.path;
				// const userInfo = await User.findOne({
				// 	where: {
				// 		id: user?.id
				// 	},
				// 	include: [
				// 		{
				// 			model: Role,
				// 			as: 'role',
				// 			include: [
				// 				{
				// 					model: Permission,
				// 					as: 'permission',
				// 					include: [
				// 						{
				// 							model: Function,
				// 							as: 'function',
				// 							where: {
				// 								path: actualPath,
				// 								method: req?.method
				// 							}
				// 						}
				// 					]
				// 				}
				// 			]
				// 		}
				// 	]
				// });
				// if (!userInfo) {
				// 	return apiResponse.unauthorizedResponse(res, 'Your token is invalid. Please make sure you have a valid auth token.');
				// }
				// if (userInfo?.role?.permission?.length === 0) {
				// 	return apiResponse.unauthorizedResponse(res, 'You are not authorized to use this api.');
				// }
				// logger.info(`${fileName}->${name} function route path ${actualPath} and method is ${req?.method}`);

				req.user = user;
				next();
			});
		} else {
			return apiResponse.unauthorizedResponse(res, 'You are not authorized.');
		}
	};
};

module.exports = authenticate;

const { User, Role, Provider, ProviderType, ServiceType, Client } = require('../models');
const { sendSignUpNotificationToSystemUsers } = require('../ws/notifications');
const apiResponse = require('../helpers/apiResponse');
const { registerSchema } = require('../validators/user');
const logger = require('../helpers/logger');
const Mailer = require('../helpers/mailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 *  User registration.
 *
 * @returns {Object}
 * @param req
 * @param res
 */

exports.register = async (req, res) => {
	try {
		if (!req.body.email) {
			return apiResponse.validationErrorWithData(res, 'Please provide a email address');
		}

		const { value, error } = registerSchema.validate(req.body);
		if (error) {
			return apiResponse.validationErrorWithData(res, error.message);
		}
		const checkedUser = await User.findOne({
			where: { email: req.body.email }
		});
		if (checkedUser) {
			return apiResponse.validationErrorWithData(res, 'User email or number already been registered. Please try another.');
		}
		value.roleId = null;
		const user = await User.create(value);
		if (user) {
			const userData = {
				id: user.id,
				roleId: user.roleId
			};
			const jwtPayload = userData;
			const jwtData = {
				expiresIn: process.env.JWT_TIMEOUT_DURATION
			};
			const secret = process.env.JWT_SECRET;
			const token = jwt.sign(jwtPayload, secret, jwtData);
			user.dataValues.token = token;

			const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
			const resetLink = `${process.env.SITE_BASE_URL}/verify-email?token=${resetToken}`;

			await Mailer.send('verify-email.html', user.email, {
				subject: 'Verify Email',
				emailVerifyLink: resetLink,
				user: user
			});

			sendSignUpNotificationToSystemUsers({ req, user }, `A new user registered. Email: ${user.email}`);
			await user.update({ emailVerificationToken: resetToken });
			return apiResponse.successResponseWithData(res, 'Your account has been created, please verify your email address', user);
		} else {
			throw new Error('Register failed');
		}
	} catch (err) {
		logger.error(err);
		return apiResponse.ErrorResponse(res, err);
	}
};

/**
 * User login.
 *
 *
 * @returns {Object}
 * @param req
 * @param res
 */

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.scope('withPassword').findOne({
			where: { email },
			include: [
				{
					model: Role,
					as: 'role'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: ProviderType,
							as: 'providerType',
							include: [
								{
									model: ServiceType,
									as: 'serviceType'
								}
							]
						}
					]
				},
				{
					model: Client,
					as: 'client'
				}
			]
		});

		if (!user) {
			return apiResponse.unauthorizedResponse(res, 'Email is not registered.');
		}
		if (user) {
			const passwordMatch = await bcrypt.compare(password, user.password);
			const isProviderTypeAvailable = user?.provider?.providerType != null;
			if (passwordMatch) {
				const userData = {
					id: user.id,
					roleId: user.roleId
				};
				const jwtPayload = userData;
				const jwtData = {
					expiresIn: process.env.JWT_TIMEOUT_DURATION
				};
				const secret = process.env.JWT_SECRET;
				const token = jwt.sign(jwtPayload, secret, jwtData);

				userData.token = token;
				userData.providerType = isProviderTypeAvailable ? true : false;

				return apiResponse.successResponseWithData(res, 'Login Success.', userData);
			} else {
				return apiResponse.unauthorizedResponse(res, 'Email or Password wrong.');
			}
		} else {
			return apiResponse.unauthorizedResponse(res, 'Email or Password wrong.');
		}
	} catch (error) {
		logger.error('Login server Error:', error);
		return apiResponse.ErrorResponse(res, error);
	}
};

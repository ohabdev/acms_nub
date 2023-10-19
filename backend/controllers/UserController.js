const {
	User,
	OtpVerification,
	Client,
	Provider,
	Role,
	ProviderType,
	Service,
	ServiceType,
	Country,
	State,
	County,
	City,
	Review,
	CityRate
} = require('../models');
const { sendUserTypeUpdateNotificationToSystemUsers } = require('../ws/notifications');
const apiResponse = require('../helpers/apiResponse');
const Helper = require('../helpers/utility');
const logger = require('../helpers/logger');
const Mailer = require('../helpers/mailer');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const {
	createUserSchema,
	updateUserProfileSchema,
	updateClientProfileSchema,
	updateProviderProfileSchema,
	userTypeUpdate,
	providerTypeUpdate,
	changePasswordSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	providerSearchQuerySchema,
	clientSearchQuerySchema,
	systemUserSearchQuerySchema
} = require('../validators/user');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const path = require('path');
const fileName = path.basename(__filename);

exports.me = async (req, res) => {
	try {
		const userId = req?.user?.id;
		const user = await User.findByPk(userId, {
			include: [
				{
					model: Role,
					as: 'role'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city',
					include: [
						{
							model: CityRate,
							as: 'cityRate'
						}
					]
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
						},
						{
							model: Service,
							where: { isDeleted: false },
							required: false,
							as: 'services'
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
			return apiResponse.notFoundResponse(res, 'User details not found');
		}

		return apiResponse.successResponseWithData(res, 'Current user details', user);
	} catch (err) {
		logger.info(err);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.checkProfileStatus = async (req, res) => {
	try {
		const userId = req.params.userId || req?.user?.id;
		const user = await User.findByPk(userId, {
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
			return apiResponse.notFoundResponse(res, 'User not found');
		}

		let message = '';

		switch (true) {
			case !user.role:
				message = 'Please update your profile user type.';
				break;
			case user.provider && user.provider.providerType == null:
				message = 'Please update your profile provider type.';
				break;
			case user.provider &&
				user.provider.providerType != null &&
				user.provider.providerType.serviceType.slug == 'attorney' &&
				(user.provider.stateBarNumber == null ||
					user.provider.proofOfMalpracticeInsurance == null ||
					user.provider.appearanceAvailability == null ||
					user.provider.yearsOfPractice == null ||
					user.provider.officeAddress == null ||
					user.provider.termsOfAgreement == null):
				message = 'Please update your attorney profile information.';
				break;
			case user.provider &&
				user.provider.providerType != null &&
				user.provider.providerType.serviceType.slug == 'paralegal' &&
				(user.provider.proofOfParalegalCertification == null ||
					user.provider.attorneyVerificationLetter == null ||
					user.provider.yearsOfPractice == null ||
					user.provider.officeAddress == null ||
					user.provider.termsOfAgreement == null):
				message = 'Please update your paralegal profile information.';
				break;
			case user.provider &&
				user.provider.providerType != null > 0 &&
				user.provider.providerType.serviceType.slug == 'processServer' &&
				(user.provider.proofOfCertification == null ||
					user.provider.proofOfBusinessLicense == null ||
					user.provider.yearsOfPractice == null ||
					user.provider.officeAddress == null ||
					user.provider.termsOfAgreement == null):
				message = 'Please update your paralegal profile information.';
				break;
			case user.firstName == null ||
				user.lastName == null ||
				user.dob == null ||
				user.gender == null ||
				user.profilePicture == null ||
				user.phoneNumber == null:
				message = 'Please update your profile basic information.';
				break;
			case user.countryId == null ||
				user.stateId == null ||
				user.countyId == null ||
				user.cityId == null ||
				user.zipCode == null ||
				user.latitude == null ||
				user.latitude == null ||
				user.address == null:
				message = 'Please update profile locations information.';
				break;
			case user.accountStatus == 'pending':
				message = 'Your profile is pending for approval.';
				break;
			case user.accountStatus == 'rejected':
				message = 'Your profile has been rejected.';
				break;
			case user.accountStatus == 'suspended':
				message = 'Your profile has been suspended.';
				break;
			default:
				message = 'profileCompleted';
				break;
		}

		return apiResponse.successResponseWithData(res, 'Profile update status', {
			profileComplete: message === 'profileCompleted',
			message
		});
	} catch (err) {
		logger.info(err);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.create = async (req, res) => {
	try {
		const userId = req.user.id;
		const { error, value } = createUserSchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const checkedUser = await User.findOne({
			where: { email: value.email }
		});

		if (checkedUser) {
			throw new Error('User already exist');
		}
		value.createdBy = userId;
		value.emailVerified = true;
		const user = await User.create(value);
		return apiResponse.successResponseWithData(res, 'New user created successfully', user);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.update = async (req, res) => {
	try {
		const userId = req.params.userId || req.user.id;

		const user = await User.findOne({
			where: { id: userId }
		});

		if (!user) {
			return apiResponse.notFoundResponse(res, 'user not found');
		}

		const validate = updateUserProfileSchema.validate(req.body);

		if (validate.error) {
			throw new Error(validate.error);
		}
		const updateUserInfo = await user.update(validate.value, {
			where: { id: userId }
		});
		return apiResponse.successResponseWithData(res, 'User profile updated successfully', updateUserInfo);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateClientProfile = async (req, res) => {
	try {
		const userId = req.params.userId || req.user.id;

		const client = await Client.findOne({
			where: { userId: userId }
		});

		if (!client) {
			return apiResponse.notFoundResponse(res, 'client not found');
		}

		const validateUpdateClient = updateClientProfileSchema.validate(req.body);

		if (validateUpdateClient.error) {
			throw new Error(validateUpdateClient.error);
		}

		await client.update(validateUpdateClient.value, {
			where: { id: userId }
		});

		const validateUpdateUser = updateUserProfileSchema.validate(req.body);

		if (validateUpdateUser.error) {
			throw new Error(validateUpdateUser.error);
		}

		await User.update(validateUpdateUser.value, {
			where: { id: userId }
		});

		const userInfo = await User.findByPk(userId, {
			include: [
				{
					model: Role,
					as: 'role'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city'
				},
				{
					model: Provider,
					as: 'provider'
				},
				{
					model: Client,
					as: 'client'
				}
			]
		});

		return apiResponse.successResponseWithData(res, 'Client profile updated successfully', userInfo);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.updateProviderProfile = async (req, res) => {
	try {
		const userId = req.params.userId || req.user.id;

		const provider = await Provider.findOne({
			where: { userId: userId }
		});

		if (!provider) {
			return apiResponse.notFoundResponse(res, 'Provider not found');
		}

		const validateUpdateProvider = updateProviderProfileSchema.validate(req.body);

		if (validateUpdateProvider.error) {
			throw new Error(validateUpdateProvider.error);
		}

		await provider.update(validateUpdateProvider.value, {
			where: { id: userId }
		});

		const validateUpdateUser = updateUserProfileSchema.validate(req.body);

		if (validateUpdateUser.error) {
			throw new Error(validateUpdateUser.error);
		}

		await User.update(validateUpdateUser.value, {
			where: { id: userId }
		});

		const user = await User.findByPk(userId, {
			include: [
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: ProviderType,
							as: 'providerType'
						}
					]
				}
			]
		});

		if (!user) {
			return apiResponse.notFoundResponse(res, 'User not found');
		}

		const serviceCities = validateUpdateProvider.value?.serviceLocations;
		const subServiceTypes = validateUpdateProvider.value?.practiceAreas;

		const serviceTypeId = user?.provider?.providerType?.serviceTypeId;

		if (!serviceTypeId) {
			return apiResponse.notFoundResponse(res, 'Please update your provide type');
		}

		if (serviceCities != undefined) {
			await Service.update(
				{ isDeleted: true },
				{
					where: {
						cityId: { [Sequelize.Op.not]: serviceCities },
						providerId: provider.id
					}
				}
			);
		}

		if (serviceCities != undefined && serviceCities.length > 0 && serviceTypeId) {
			for (const cityId of serviceCities) {
				for (const subServiceTypeId of subServiceTypes) {
					const serviceType = await ServiceType.findOne({ where: { id: subServiceTypeId } });

					const existingService = await Service.findOne({
						where: { subServiceTypeId: subServiceTypeId, cityId: cityId, providerId: provider.id }
					});

					const serviceCreateParams = {
						serviceName: serviceType.name,
						serviceTypeId: serviceTypeId,
						subServiceTypeId: subServiceTypeId,
						countryId: user.countryId,
						stateId: user.stateId,
						countyId: user.countyId,
						cityId: cityId,
						providerId: provider.id,
						isDeleted: false
					};

					if (!existingService) {
						await Service.create(serviceCreateParams);
					} else {
						if (existingService.isDeleted === true) {
							await existingService.update(serviceCreateParams);
						}
					}
				}
			}
		}

		const userInfo = await User.findByPk(userId, {
			include: [
				{
					model: Role,
					as: 'role'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: ProviderType,
							as: 'providerType',
							required: false,
							include: [
								{
									model: ServiceType,
									as: 'serviceType'
								}
							]
						},
						{
							model: Service,
							where: { isDeleted: false, providerId: provider.id },
							required: false,
							as: 'services',
							include: [
								{
									model: Country,
									as: 'country',
									required: true
								},
								{
									model: County,
									as: 'county',
									required: false
								},
								{
									model: State,
									as: 'state',
									required: true
								},
								{
									model: City,
									as: 'city',
									required: true,
									include: [
										{
											model: CityRate,
											as: 'cityRate'
										}
									]
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

		return apiResponse.successResponseWithData(res, 'Provider profile updated successfully', userInfo);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.sendOtp = async (req, res) => {
	try {
		const userId = req.params.userId || req.user.id;
		const user = await User.findOne({
			where: { id: req.user.id }
		});

		if (!user) {
			return apiResponse.notFoundResponse(res, 'user not found');
		}

		const radomOtpNumber = Helper.randomNumber(4);
		const [, updatedUser] = await User.update(req.body, {
			where: { id: userId },
			returning: true
		});

		await OtpVerification.create({
			userId: userId,
			otp: radomOtpNumber
		});

		if (updatedUser > 0) {
			return apiResponse.successResponseWithData(res, 'Otp sent successfully', { otp: radomOtpNumber });
		} else {
			return apiResponse.notFoundResponse(res, 'User not found');
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.userTypeUpdate = async (req, res) => {
	const name = 'userTypeUpdate';
	try {
		const userId = req.user.id;

		const user = await User.findOne({
			where: { id: userId }
		});

		if (user.roleId != null) {
			return apiResponse.notFoundResponse(res, 'User type already updated');
		}

		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		const validate = userTypeUpdate.validate(req.body);
		if (validate.error) {
			throw new Error(validate.error);
		}

		if (validate.value.isClient == true) {
			await Client.create({ userId: userId });
			const role = await Role.findOne({ where: { isClient: true } });

			await user.update(
				{ roleId: role.id },
				{
					where: { id: userId }
				}
			);
		}

		if (validate.value.isProvider == true) {
			await Provider.create({ userId: userId });
			const role = await Role.findOne({ where: { isProvider: true } });
			await user.update(
				{ roleId: role.id },
				{
					where: { id: userId }
				}
			);
		}

		const updateUserInfo = await User.findByPk(userId, {
			include: [
				{
					model: Role,
					as: 'role'
				},
				{
					model: Provider,
					as: 'provider'
				},
				{
					model: Client,
					as: 'client'
				}
			]
		});

		let notifyMsg = '';

		if (validate.value.isProvider == true) {
			notifyMsg = `A user updated profile to provider. Email: ${updateUserInfo.email}`;
		} else {
			notifyMsg = `A user updated profile to client. Email: ${updateUserInfo.email}`;
		}

		sendUserTypeUpdateNotificationToSystemUsers(req, notifyMsg);
		return apiResponse.successResponseWithData(res, 'User type updated successfully', updateUserInfo);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.providerTypeUpdate = async (req, res) => {
	const name = 'providerTypeUpdate';
	try {
		const userId = req.user.id;

		const provider = await Provider.findOne({
			where: { userId: userId }
		});

		if (!provider) {
			return apiResponse.notFoundResponse(res, 'Provider not found');
		}

		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		const { value, error } = providerTypeUpdate.validate(req.body);

		if (error) {
			throw new Error(error.message);
		}

		await ProviderType.destroy({
			where: {
				providerId: provider.id
			}
		});

		const serviceTypeIds = value.serviceTypeIds;
		for (const serviceTypeId of serviceTypeIds) {
			await ProviderType.create({ providerId: provider.id, serviceTypeId: serviceTypeId });
		}

		return apiResponse.successResponseWithData(res, 'Provider type updated successfully', { success: true });
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getProviderTypes = async (req, res) => {
	const name = 'getProviderTypes';
	try {
		const userId = req.user.id;

		const provider = await Provider.findOne({
			where: { userId: userId }
		});

		if (!provider) {
			return apiResponse.notFoundResponse(res, 'Provider not found');
		}

		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		const providerTypes = await ProviderType.findAndCountAll({
			where: {
				providerId: provider.id
			},
			include: [
				{
					model: ServiceType,
					as: 'serviceType'
				}
			]
		});

		return apiResponse.successResponseWithData(res, 'Provider types', providerTypes);
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.verifyOtp = async (req, res) => {
	try {
		const userId = req.params.userId || req.user.id;
		const otp = await OtpVerification.findOne({
			where: { userId: userId, otp: req.body.otp }
		});

		if (!otp) {
			return apiResponse.notFoundResponse(res, 'Otp not found');
		}
		if (otp.otp != req.body.otp) {
			return apiResponse.notFoundResponse(res, 'Otp not matched');
		}

		if (otp.otp == req.body.otp) {
			const updateOtp = await OtpVerification.update(
				{ isVerified: true },
				{
					where: { userId: userId },
					returning: true
				}
			);
			if (updateOtp && updateOtp[1] > 0) {
				const updateUser = await User.update(
					{ phoneVerified: true },
					{
						where: { id: userId },
						returning: true
					}
				);
				if (updateUser && updateUser[1] > 0) {
					return apiResponse.successResponseWithData(res, 'Otp verified successfully', { isVerified: true });
				}
			} else {
				return apiResponse.validationErrorWithData(res, 'Invalid OTP');
			}
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.resendEmail = async (req, res) => {
	try {
		const userId = req.params.userId || req.user.id;

		if (!req.body.email) {
			return apiResponse.validationErrorWithData(res, 'Please give valid email.');
		}

		const user = await User.findOne({
			where: { id: userId, email: req.body.email }
		});

		if (!user) {
			return apiResponse.validationErrorWithData(res, "Your email isn't not registered.");
		}

		const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
		const resetLink = `${process.env.SITE_BASE_URL}/verify-email?token=${resetToken}`;

		await Mailer.send('verify-email.html', user.email, {
			subject: 'Verify Email',
			emailVerifyLink: resetLink,
			user: user
		});

		await user.update({ emailVerified: false, emailVerificationToken: resetToken });

		return apiResponse.successResponseWithData(res, 'Email resend successfully');
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		const userId = req.params.userId || req.user.id;

		if (!req.body.token) {
			return apiResponse.validationErrorWithData(res, 'Please give valid token.');
		}

		const user = await User.findOne({
			where: { id: userId }
		});

		if (user.emailVerified == true) {
			return apiResponse.validationErrorWithData(res, 'Your email already verified');
		}
		const token = await User.findOne({
			where: { emailVerificationToken: req.body.token, id: userId }
		});

		if (!token) {
			return apiResponse.validationErrorWithData(res, "Your token isn't valid.");
		}
		await user.update({ emailVerified: true, emailVerificationToken: null });
		return apiResponse.successResponseWithData(res, 'Email verified successfully', { isVerified: true });
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.forgotPassword = async (req, res) => {
	try {
		const { value, error } = forgotPasswordSchema.validate(req.body);

		if (error) {
			throw new Error(error.message);
		}

		const user = await User.findOne({
			where: { email: value.email }
		});

		if (!user) {
			return apiResponse.notFoundResponse(res, 'user not found');
		}

		const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: 30 * 60 // 30 min
		});

		await user.update({ passwordResetToken: resetToken });

		const resetLink = `${process.env.SITE_BASE_URL}/reset-password?token=${resetToken}`;
		const appResetLink = `${process.env.APP_DEEP_LINK}/reset-password?token=${resetToken}`;

		await Mailer.send('forgot-password.html', user.email, {
			subject: 'Forgot password',
			passwordResetLink: resetLink,
			passwordAppResetLink: appResetLink
		});

		return apiResponse.successResponseWithData(res, 'Please check your email', {
			message: 'Your forgot password email has been sent.',
			resetToken: resetToken
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.changePassword = async (req, res) => {
	try {
		const userId = req.params.userId || req.user.id;
		const validate = changePasswordSchema.validate(req.body);
		const user = await User.scope('withPassword').findByPk(userId);
		if (!user) {
			return apiResponse.notFoundResponse(res, 'user not found');
		}
		if (validate.error) {
			throw new Error(validate.error);
		}

		const passwordMatch = await bcrypt.compare(validate.value.oldPassword, user.password);
		if (!passwordMatch) {
			return apiResponse.unauthorizedResponse(res, 'Your old password incorrect.');
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(validate.value.newPassword, saltRounds);

		await user.update({ password: hashedPassword }, { where: { id: userId } });
		return apiResponse.successResponseWithData(res, `Password updated successfully`, {
			success: true
		});
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { value, error } = resetPasswordSchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}

		const user = await User.findOne({
			where: { passwordResetToken: value.token }
		});

		if (!user) {
			return apiResponse.notFoundResponse(res, 'Invalid password reset token, Not found');
		}

		return jwt.verify(value.token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return apiResponse.unauthorizedResponse(res, 'Your token is invalid. Please make sure you have a valid auth token.');
			}
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(value.newPassword, saltRounds);
			await User.update({ password: hashedPassword, passwordResetToken: null }, { where: { id: user.userId } });
			return apiResponse.successResponseWithData(res, `Password updated successfully`, {
				success: true
			});
		});
	} catch (err) {
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getAllUsers = async (req, res) => {
	const name = 'getAllUsers';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);
		const roleId = parseInt(req?.query?.roleId);
		const nameValue = req?.query?.name;
		const email = req?.query?.email;
		const gender = req?.query?.gender;
		const phoneNumber = req?.query?.phoneNumber;
		const username = req?.query?.username;
		const query = {
			isDeleted: false
		};

		if (roleId) {
			query.roleId = roleId;
		}
		if (gender) {
			query.gender = gender;
		}
		if (email) {
			query[Op.or] = [
				{
					email: {
						[Op.like]: `%${email}%`
					}
				}
			];
		}

		if (phoneNumber) {
			query[Op.or] = [
				{
					phoneNumber: {
						[Op.like]: `%${phoneNumber}%`
					}
				}
			];
		}

		if (username) {
			query[Op.or] = [
				{
					username: {
						[Op.like]: `%${username}%`
					}
				}
			];
		}

		if (nameValue) {
			query[Op.or] = [
				{
					firstName: {
						[Op.like]: `%${nameValue}%`
					}
				},
				{
					lastName: {
						[Op.like]: `%${nameValue}%`
					}
				}
			];
		}

		const users = await User.findAndCountAll({
			distinct: true,
			where: query,
			include: [
				{
					model: Role,
					as: 'role'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city',
					include: [
						{
							model: CityRate,
							as: 'cityRate'
						}
					]
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
						},
						{
							model: Service,
							where: { isDeleted: false },
							required: false,
							as: 'services'
						}
					]
				},
				{
					model: Client,
					as: 'client'
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(users)}`);
		return apiResponse.successResponseWithData(res, 'All Users', users);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getAllProviders = async (req, res) => {
	const name = 'getAllProviders';
	try {
		logger.info(`${fileName}->${name} params received from client: ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit = ${limit} and offset = ${offset} for fetching data from the database`);

		const { error, value } = providerSearchQuerySchema.validate(req.query);
		if (error) {
			throw new Error(error.message);
		}

		const query = {
			isDeleted: false
		};

		if (value.gender) {
			query.gender = value.gender;
		}

		if (value.q) {
			query[Op.or] = [
				{
					email: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					phoneNumber: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					username: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					firstName: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					lastName: {
						[Op.like]: `%${value.q}%`
					}
				}
			];
		}

		const providers = await User.findAndCountAll({
			distinct: true,
			where: query,
			include: [
				{
					model: Role,
					as: 'role',
					where: {
						isProvider: true
					}
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city',
					include: [
						{
							model: CityRate,
							as: 'cityRate'
						}
					]
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
						},
						{
							model: Service,
							where: { isDeleted: false },
							required: false,
							as: 'services'
						}
					]
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database: ${JSON.stringify(providers)}`);
		return apiResponse.successResponseWithData(res, 'All Providers', providers);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Data could not be fetched, and an error occurred: ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getAllClients = async (req, res) => {
	const name = 'getAllClients';
	try {
		logger.info(`${fileName}->${name} params received from client: ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit = ${limit} and offset = ${offset} for fetching data from the database`);

		const { error, value } = clientSearchQuerySchema.validate(req.query);
		if (error) {
			throw new Error(error.message);
		}

		const query = {
			isDeleted: false
		};

		if (value.gender) {
			query.gender = value.gender;
		}

		if (value.q) {
			query[Op.or] = [
				{
					email: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					phoneNumber: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					username: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					firstName: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					lastName: {
						[Op.like]: `%${value.q}%`
					}
				}
			];
		}

		const clients = await User.findAndCountAll({
			distinct: true,
			where: query,
			include: [
				{
					model: Role,
					as: 'role',
					where: {
						isClient: true
					}
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city',
					include: [
						{
							model: CityRate,
							as: 'cityRate'
						}
					]
				},
				{
					model: Client,
					as: 'client'
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database: ${JSON.stringify(clients)}`);
		return apiResponse.successResponseWithData(res, 'All Clients', clients);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Data could not be fetched, and an error occurred: ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getAllSystemUsers = async (req, res) => {
	const name = 'getAllSystemUsers';
	try {
		logger.info(`${fileName}->${name} params received from client: ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit = ${limit} and offset = ${offset} for fetching data from the database`);

		const { error, value } = systemUserSearchQuerySchema.validate(req.query);
		if (error) {
			throw new Error(error.message);
		}

		const query = {
			isDeleted: false
		};
		if (value.gender) {
			query.gender = value.gender;
		}
		if (value.q) {
			query[Op.or] = [
				{
					email: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					phoneNumber: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					username: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					firstName: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					lastName: {
						[Op.like]: `%${value.q}%`
					}
				}
			];
		}

		const systemUsers = await User.findAndCountAll({
			distinct: true,
			where: query,
			include: [
				{
					model: Role,
					as: 'role',
					where: {
						isSystemUser: true
					}
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database: ${JSON.stringify(systemUsers)}`);
		return apiResponse.successResponseWithData(res, 'All System Users', systemUsers);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Data could not be fetched, and an error occurred: ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.getSingleUser = async (req, res) => {
	const name = 'getSingleUser';
	try {
		const user = await User.findOne({
			where: {
				isDeleted: false,
				id: req.params.userId
			},
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
						},
						{
							model: Review,
							as: 'reviews',
							where: { userType: 'client' }
						}
					]
				},
				{
					model: Client,
					as: 'client'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: City,
					as: 'city'
				}
			]
		});
		if (!user) {
			throw new Error('User not found');
		} else {
			logger.info(`${fileName}->${name} User successfully fetched for ${req.params.id} this ID data=${JSON.stringify(user)}`);
			return apiResponse.successResponseWithData(res, 'Single user details', user);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

exports.getProviderDetails = async (req, res) => {
	const name = 'getProviderDetails';
	try {
		const provider = await Provider.findOne({
			where: {
				id: req.params.providerId
			},
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
				},
				{
					model: Review,
					as: 'reviews',
					where: { userType: 'client' }
				},
				{
					model: User,
					as: 'user',
					include: [
						{
							model: Country,
							as: 'country'
						},
						{
							model: State,
							as: 'state'
						},
						{
							model: County,
							as: 'county'
						},
						{
							model: City,
							as: 'city'
						}
					]
				}
			]
		});

		if (!provider) {
			throw new Error('Provider not found');
		} else {
			logger.info(`${fileName}->${name} Provider successfully fetched for ${req.params.id} this ID data=${JSON.stringify(provider)}`);
			return apiResponse.successResponseWithData(res, 'Single provider details', provider);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

exports.deleteOne = async (req, res) => {
	const name = 'deleteOne';
	try {
		const user = await User.findOne({
			where: {
				isDeleted: false,
				id: req.params.userId
			}
		});
		if (!user) {
			throw new Error('User not found ');
		} else {
			await user.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.userId
					}
				}
			);
			logger.info(`${fileName}->${name} User successfully deleted and return object ${JSON.stringify(user)}`);
			return apiResponse.successResponseWithData(res, 'User successfully deleted', user);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} User successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

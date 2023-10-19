const Joi = require('joi');

exports.userTypeUpdate = Joi.object({
	isProvider: Joi.boolean().required(),
	isClient: Joi.boolean().required()
}).unknown(true);

exports.providerTypeUpdate = Joi.object({
	serviceTypeIds: Joi.array().items(Joi.number().integer()).min(1).required()
}).unknown(true);

exports.createUserSchema = Joi.object({
	roleId: Joi.number().integer().min(1).required(),
	firstName: Joi.string().trim().min(1).optional(),
	lastName: Joi.string().trim().min(1).optional(),
	username: Joi.string().trim().min(1).optional(),
	email: Joi.string().trim().email().required(),
	password: Joi.string()
		.trim()
		.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=]).{8,}$/)
		.required(),
	phoneNumber: Joi.string()
		.trim()
		.pattern(/^\d{3}-\d{3}-\d{4}$/)
		.optional()
}).unknown(true);

exports.updateUserProfileSchema = Joi.object({
	username: Joi.string(),
	firstName: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email(),
	dob: Joi.date().allow(null).optional(),
	gender: Joi.string().valid('male', 'female', 'other'),
	profilePicture: Joi.string().allow(null).optional(),
	phoneNumber: Joi.string().pattern(/^\d{3}-\d{3}-\d{4}$/),
	accountStatus: Joi.string().valid('pending', 'approved', 'rejected', 'suspended'),
	countryId: Joi.number(),
	countyId: Joi.number().optional().allow(null),
	stateId: Joi.number(),
	cityId: Joi.number(),
	zipCode: Joi.string(),
	latitude: Joi.string(),
	longitude: Joi.string()
}).unknown(true);

exports.updateClientProfileSchema = Joi.object({
	additionalDetails: Joi.string().allow(null).optional(),
	identificationNumber: Joi.string().allow(null).optional(),
	emergencyContactName: Joi.string().allow(null).optional(),
	emergencyContactNumber: Joi.string().allow(null).optional(),
	maritalStatus: Joi.string().allow(null).optional(),
	spouseName: Joi.string().allow(null).optional(),
	preferredLanguage: Joi.string().allow(null).optional(),
	preferredContactMethod: Joi.string().allow(null).optional(),
	socialMediaProfiles: Joi.string().allow(null).optional(),
	primaryEmail: Joi.string().allow(null).optional()
}).unknown(true);

exports.updateProviderProfileSchema = Joi.object({
	serviceLocations: Joi.array().items(Joi.number().integer().positive()).optional(),
	practiceAreas: Joi.array().items(Joi.number().integer().positive()).optional(),
	//for attorney fields
	stateBarNumber: Joi.string().optional(),
	proofOfMalpracticeInsurance: Joi.string().allow(null).optional(),
	appearanceAvailability: Joi.string().valid('in-person', 'remote-only', 'both').optional(),
	//for paralegal fields
	proofOfParalegalCertification: Joi.string().allow(null).optional(),
	attorneyVerificationLetter: Joi.string().allow(null).optional(),
	//for process server fields
	proofOfCertification: Joi.string().allow(null).optional(),
	proofOfBusinessLicense: Joi.string().allow(null).optional(),
	// common fields
	yearsOfPractice: Joi.string().valid('1-10', '11-20', '21-30', '30+').optional(),
	officeAddress: Joi.string().optional(),
	termsOfAgreement: Joi.string().optional()
}).unknown(true);

exports.changePasswordSchema = Joi.object({
	oldPassword: Joi.string().max(128).required(),
	newPassword: Joi.string().max(128).required()
});

exports.resetPasswordSchema = Joi.object({
	token: Joi.string().required(),
	newPassword: Joi.string().max(128).required()
});

exports.forgotPasswordSchema = Joi.object({
	email: Joi.string().email()
}).unknown(true);

exports.providerSearchQuerySchema = Joi.object({
	limit: Joi.number().integer(),
	page: Joi.number().integer(),
	q: Joi.string(),
	gender: Joi.string().valid('male', 'female', 'other')
});

exports.clientSearchQuerySchema = Joi.object({
	limit: Joi.number().integer(),
	page: Joi.number().integer(),
	q: Joi.string(),
	gender: Joi.string().valid('male', 'female', 'other')
});

exports.systemUserSearchQuerySchema = Joi.object({
	limit: Joi.number().integer(),
	page: Joi.number().integer(),
	q: Joi.string(),
	gender: Joi.string().valid('male', 'female', 'other')
});

exports.registerSchema = Joi.object({
	firstName: Joi.string().trim().min(1).optional(),
	lastName: Joi.string().trim().min(1).optional(),
	email: Joi.string().trim().email().required(),
	password: Joi.string()
		.trim()
		.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=]).{8,}$/)
		.required()
}).unknown(true);

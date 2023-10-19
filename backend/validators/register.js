const Joi = require('joi');

const registerSchema = Joi.object({
	role: Joi.string().valid('client', 'provider').required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required(),
	termsAndCondition: Joi.boolean().required(),
	phone: Joi.object({
		office: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).required(),
		cell: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).required()
	}).required(),
	password: Joi.string()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%^*?&])[A-Za-z\\d@$!%^*?&]{8,}$'))
		.message(
			'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
		)
		.required()
})
	.when(Joi.object({ role: Joi.string().valid('attorney') }).unknown(), {
		then: Joi.object({
			stateBarNumber: Joi.string().required(),
			yearsOfPractice: Joi.string().valid('1-10', '11-20', '21-30', '30+').required(),
			proofOfMalpracticeInsurance: Joi.string().required(),
			officeAddress: Joi.string().required(),
			practiceAreas: Joi.array().items(Joi.string().required()).required(),
			geographicPracticeLocations: Joi.array()
				.items(
					Joi.object({
						state: Joi.string().required(),
						county: Joi.string().required(),
						city: Joi.string().required(),
						location: Joi.object({
							type: Joi.string().valid('Point').default('Point'),
							coordinates: Joi.array().length(2).items(Joi.number()).required()
						}).optional()
					})
				)
				.required(),
			appearanceAvailability: Joi.string().valid('in-person', 'remote-only', 'both').required(),
			termsOfAgreement: Joi.string().required()
		})
	})
	.when(Joi.object({ role: Joi.string().valid('paralegal') }).unknown(), {
		then: Joi.object({
			phoneNumber: Joi.object({
				office: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).required(),
				cell: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).required()
			}).required(),
			proofOfParalegalCertification: Joi.string().required(),
			attorneyVerificationLetter: Joi.string().required(),
			officeAddress: Joi.string().required(),
			practiceAreas: Joi.array().items(Joi.string().required()).required(),
			yearsOfPractice: Joi.string().valid('1-10', '11-20', '21-30', '30+').required(),
			geographicPracticeLocations: Joi.array()
				.items(
					Joi.object({
						state: Joi.string().required(),
						county: Joi.string().required(),
						city: Joi.string().required(),
						location: Joi.object({
							type: Joi.string().valid('Point').default('Point'),
							coordinates: Joi.array().length(2).items(Joi.number()).required()
						}).optional()
					})
				)
				.required(),
			scopeOfServicesProvided: Joi.array().items(Joi.string().required()).required(),
			termsOfAgreement: Joi.string().required()
		})
	})
	.when(Joi.object({ role: Joi.string().valid('process_server') }).unknown(), {
		then: Joi.object({
			phoneNumber: Joi.object({
				office: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).required(),
				cell: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).required()
			}).required(),
			proofOfCertification: Joi.string().required(),
			proofOfBusinessLicense: Joi.string().required(),
			yearsOfPractice: Joi.string().valid('1-10', '11-20', '21-30', '30+').required(),
			geographicPracticeLocations: Joi.array()
				.items(
					Joi.object({
						state: Joi.string().required(),
						county: Joi.string().required(),
						city: Joi.string().required(),
						location: Joi.object({
							type: Joi.string().valid('Point').default('Point'),
							coordinates: Joi.array().length(2).items(Joi.number()).required()
						}).optional()
					})
				)
				.required(),
			scopeOfServicesProvided: Joi.array().items(Joi.string().required()).required(),
			termsOfAgreement: Joi.string().required()
		})
	})
	.when(Joi.object({ role: Joi.string().valid('client') }).unknown(), {
		then: Joi.object({
			address: Joi.string().required(),
			phone: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).required(),
			geographicalLocation: Joi.object({
				state: Joi.string().required(),
				county: Joi.string().required(),
				city: Joi.string().required(),
				zipCode: Joi.string().required()
			}).required()
		})
	});

module.exports = registerSchema;

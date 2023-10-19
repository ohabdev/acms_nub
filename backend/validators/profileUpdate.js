const Joi = require('joi');

const updateProfileSchema = Joi.object({
	role: Joi.string().valid('client', 'attorney', 'paralegal', 'process_server', 'admin').required(),
	firstName: Joi.string().optional(),
	lastName: Joi.string().optional(),
	email: Joi.string().email().optional(),
	profilePic: Joi.string().optional()
})
	.when(Joi.object({ role: Joi.string().valid('attorney') }).unknown(), {
		then: Joi.object({
			phoneNumber: Joi.object({
				office: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).optional(),
				cell: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).optional()
			}).optional(),
			stateBarNumber: Joi.string().optional(),
			yearsOfPractice: Joi.string().valid('1-10', '11-20', '21-30', '30+').optional(),
			proofOfMalpracticeInsurance: Joi.string().optional(),
			officeAddress: Joi.string().optional(),
			practiceAreas: Joi.array().items(Joi.string().optional()).optional(),
			geographicPracticeLocations: Joi.array()
				.items(
					Joi.object({
						_id: Joi.string().optional(),
						state: Joi.string().optional(),
						county: Joi.string().optional(),
						city: Joi.string().optional(),
						location: Joi.object({
							type: Joi.string().valid('Point').default('Point'),
							coordinates: Joi.array().length(2).items(Joi.number()).optional()
						}).optional()
					})
				)
				.optional(),
			appearanceAvailability: Joi.string().valid('in-person', 'remote-only', 'both').optional(),
			termsOfAgreement: Joi.string().optional()
		})
	})
	.when(Joi.object({ role: Joi.string().valid('paralegal') }).unknown(), {
		then: Joi.object({
			phoneNumber: Joi.object({
				office: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).optional(),
				cell: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).optional()
			}).optional(),
			proofOfParalegalCertification: Joi.string().optional(),
			attorneyVerificationLetter: Joi.string().optional(),
			officeAddress: Joi.string().optional(),
			practiceAreas: Joi.array().items(Joi.string().optional()).optional(),
			yearsOfPractice: Joi.string().valid('1-10', '11-20', '21-30', '30+').optional(),
			geographicPracticeLocations: Joi.array()
				.items(
					Joi.object({
						state: Joi.string().optional(),
						county: Joi.string().optional(),
						city: Joi.string().optional(),
						location: Joi.object({
							type: Joi.string().valid('Point').default('Point'),
							coordinates: Joi.array().length(2).items(Joi.number()).optional()
						}).optional()
					})
				)
				.optional(),
			scopeOfServicesProvided: Joi.array().items(Joi.string().optional()).optional(),
			termsOfAgreement: Joi.string().optional()
		})
	})
	.when(Joi.object({ role: Joi.string().valid('process_server') }).unknown(), {
		then: Joi.object({
			phoneNumber: Joi.object({
				office: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).optional(),
				cell: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).optional()
			}).optional(),
			proofOfCertification: Joi.string().optional(),
			proofOfBusinessLicense: Joi.string().optional(),
			yearsOfPractice: Joi.string().valid('1-10', '11-20', '21-30', '30+').optional(),
			geographicPracticeLocations: Joi.array()
				.items(
					Joi.object({
						state: Joi.string().optional(),
						county: Joi.string().optional(),
						city: Joi.string().optional(),
						location: Joi.object({
							type: Joi.string().valid('Point').default('Point'),
							coordinates: Joi.array().length(2).items(Joi.number()).optional()
						}).optional()
					})
				)
				.optional(),
			scopeOfServicesProvided: Joi.array().items(Joi.string().optional()).optional(),
			termsOfAgreement: Joi.string().optional()
		})
	})
	.when(Joi.object({ role: Joi.string().valid('client') }).unknown(), {
		then: Joi.object({
			address: Joi.string().optional(),
			phone: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).optional(),
			geographicalLocation: Joi.object({
				_id: Joi.string().optional(),
				state: Joi.string().optional(),
				county: Joi.string().optional(),
				city: Joi.string().optional(),
				zipCode: Joi.string().optional()
			}).optional()
		})
	})
	.when(Joi.object({ role: Joi.string().valid('admin') }).unknown(), {
		then: Joi.object({
			phone: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).optional()
		})
	});

module.exports = updateProfileSchema;

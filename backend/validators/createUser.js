const Joi = require('joi');

const createUserSchema = Joi.object({
	role: Joi.string().valid('admin').required(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
		.message(
			'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
		)
		.required()
}).when(Joi.object({ role: Joi.string().valid('admin') }).unknown(), {
	then: Joi.object({
		phone: Joi.string().pattern(new RegExp('^\\d{3}-\\d{3}-\\d{4}$')).required()
	})
});

module.exports = createUserSchema;

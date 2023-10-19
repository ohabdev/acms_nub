const Joi = require('joi');

const userSearchSchema = Joi.object({
	page: Joi.number().optional(),
	take: Joi.number().optional(),
	role: Joi.string().valid('client', 'attorney', 'paralegal', 'process_server', 'admin').optional(),
	name: Joi.string().optional(),
	state: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
	county: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
	city: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
	email: Joi.string().email().optional(),
	phoneNumber: Joi.string().optional(),
	phoneVerified: Joi.boolean().optional(),
	emailVerified: Joi.boolean().optional(),
	status: Joi.string().valid('pending', 'rejected', 'approved', 'suspended').optional()
});

module.exports = userSearchSchema;

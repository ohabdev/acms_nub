const Joi = require('joi');

const statusSchema = Joi.object({
	status: Joi.string().valid('pending', 'rejected', 'approved', 'suspended').required()
});

module.exports = statusSchema;

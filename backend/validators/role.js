const Joi = require('joi');

exports.createRoleSchema = Joi.object({
	roleName: Joi.string().required(),
	createdBy: Joi.number().required(),
	permissions: Joi.array()
		.items(
			Joi.object({
				functionId: Joi.number().integer().min(1).required()
			})
		)
		.min(1)
		.required()
}).unknown(true);

exports.updateRoleSchema = Joi.object({
	roleName: Joi.string().optional(),
	updatedBy: Joi.number().required(),
	permissions: Joi.array()
		.items(
			Joi.object({
				functionId: Joi.number().integer().min(1).required()
			})
		)
		.min(1)
		.required()
}).unknown(true);

const Joi = require('joi');

exports.createReviewSchema = Joi.object({
	clientId: Joi.number().integer().required(),
	serviceId: Joi.number().integer().required(),
	providerId: Joi.number().integer().required(),
	orderId: Joi.number().integer().required(),
	userType: Joi.string(),
	rating: Joi.number().integer().min(1).max(5).required(),
	review: Joi.string().max(500).required(),
	parentId: Joi.optional()
});

exports.updateReviewSchema = Joi.object({
	clientId: Joi.number().integer(),
	serviceId: Joi.number().integer(),
	providerId: Joi.number().integer(),
	orderId: Joi.number().integer(),
	userType: Joi.string(),
	rating: Joi.number().integer().min(1).max(5),
	review: Joi.string().max(500),
	parentId: Joi.optional()
});

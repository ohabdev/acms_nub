const Joi = require('joi');

const createOrderSchema = Joi.object({
	caseDescription: Joi.string().allow(null, ''),
	hearingDate: Joi.date().allow(null).optional(),
	isCourtLocationKnown: Joi.string().valid('YES', 'NO').required(),
	isCourtLocationRemote: Joi.string().valid('YES', 'NO').required(),
	courtLocation: Joi.string().optional(),
	serviceId: Joi.number().required(),
	opposingPartyName: Joi.string().optional()
});

const updateOrderSchema = Joi.object({
	caseDescription: Joi.string().allow(null, ''),
	hearingDate: Joi.date().allow(null).optional(),
	isCourtLocationKnown: Joi.string().valid('YES', 'NO').optional(),
	isCourtLocationRemote: Joi.string().valid('YES', 'NO').optional(),
	courtLocation: Joi.string().optional(),
	serviceId: Joi.number().required(),
	opposingPartyName: Joi.string().optional(),
	status: Joi.string().valid('init', 'approved', 'ongoing', 'completed')
});

module.exports = {
	createOrderSchema,
	updateOrderSchema
};

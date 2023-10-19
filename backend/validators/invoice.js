const Joi = require('joi');

exports.createInvoiceSchema = Joi.object({
	clientId: Joi.number().integer().required(),
	providerId: Joi.number().integer().required(),
	orderId: Joi.number().integer().required(),
	amount: Joi.number().min(0).required(),
	currency: Joi.string().required(),
	status: Joi.string().valid('paid', 'unpaid', 'partial').default('paid')
});

exports.updateInvoiceSchema = Joi.object({
	amount: Joi.number().min(0).required(),
	currency: Joi.string().required(),
	status: Joi.string().valid('paid', 'unpaid', 'partial').required()
});

const Joi = require('joi');

exports.createTransactionSchema = Joi.object({
	clientId: Joi.number().integer().required(),
	invoiceId: Joi.number().integer().required(),
	providerId: Joi.number().integer().required(),
	orderId: Joi.number().integer().required(),
	tnxId: Joi.string().optional(),
	invoicePath: Joi.string().optional(),
	transactionType: Joi.string().valid('cod', 'card', 'bank').required(),
	amount: Joi.number().min(0).required(),
	currency: Joi.string().required(),
	transactionStatus: Joi.string().valid('completed', 'incomplete').default('incomplete'),
	paymentMethod: Joi.string().optional()
});

exports.updateTransactionSchema = Joi.object({
	clientId: Joi.number().integer(),
	invoiceId: Joi.number().integer(),
	providerId: Joi.number().integer(),
	orderId: Joi.number().integer(),
	tnxId: Joi.string().optional(),
	invoicePath: Joi.string().optional(),
	transactionType: Joi.string().valid('cod', 'card', 'bank'),
	amount: Joi.number().min(0),
	currency: Joi.string(),
	transactionStatus: Joi.string().valid('completed', 'incomplete'),
	paymentMethod: Joi.string().optional()
});

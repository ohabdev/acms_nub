const Joi = require('joi');
// Define Joi schemas for validation
exports.createQuoteSchem = Joi.object({
    serviceId: Joi.number().required(),
    providerId: Joi.number().required(),
    price: Joi.number().required(),
    serviceName: Joi.string().required()
}).unknown(true);

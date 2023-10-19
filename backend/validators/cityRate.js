const Joi = require('joi');

exports.createCityRateSchema = Joi.object({
	cityId: Joi.number().required(),
	attorneyRate: Joi.number().required(),
	paralegalRate: Joi.number().required(),
	processServerRate: Joi.number().required(),
	createdBy: Joi.number().optional()
}).unknown(true);

exports.updateCityRateSchema = Joi.object({
	cityId: Joi.number().required(),
	attorneyRate: Joi.number().required(),
	paralegalRate: Joi.number().required(),
	processServerRate: Joi.number().required(),
	updatedBy: Joi.number().required()
}).unknown(true);

exports.searchCityRateSchema = Joi.object({
	q: Joi.string()
		.optional()
		.custom((value, helper) => {
			const sanitizedValue = sanitizeHtml(value, {
				allowedTags: [],
				allowedAttributes: {}
			});

			if (!sanitizedValue) {
				return helper.error('Invalid search string');
			}

			return sanitizedValue;
		})
}).unknown(true);

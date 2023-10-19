const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');
exports.createCitySchema = Joi.object({
	name: Joi.string().required(),
	countryId: Joi.number().required(),
	stateId: Joi.number().required(),
	countyId: Joi.number().optional(),
	createdBy: Joi.number().optional()
}).unknown(true);

exports.updateCitySchema = Joi.object({
	name: Joi.string().optional(),
	countryId: Joi.number().required(),
	stateId: Joi.number().required(),
	countyId: Joi.number().optional(),
	updatedBy: Joi.number().required()
}).unknown(true);

exports.searchCitySchema = Joi.object({
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

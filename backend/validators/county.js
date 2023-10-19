const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');
exports.createCountySchema = Joi.object({
	name: Joi.string().required(),
	countryId: Joi.number().required(),
	stateId: Joi.number().required(),
	createdBy: Joi.number().required()
}).unknown(true);

exports.updateCountySchema = Joi.object({
	name: Joi.string().optional(),
	countryId: Joi.number().required(),
	stateId: Joi.number().required(),
	updatedBy: Joi.number().required()
}).unknown(true);

exports.searchCountySchema = Joi.object({
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
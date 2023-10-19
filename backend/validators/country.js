const Joi = require('joi'); // Import Joi
const sanitizeHtml = require('sanitize-html');
// Define Joi schemas for validation
exports.createCountrySchema = Joi.object({
	name: Joi.string().required()
}).unknown(true);

exports.searchCountrySchema = Joi.object({
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

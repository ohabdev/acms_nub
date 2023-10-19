const Joi = require('joi'); // Import Joi

// Define Joi schemas for validation
exports.createServiceTypeSchema = Joi.object({
	name: Joi.string().required(),
	categoryId: Joi.number().required(),
	parentId: Joi.number().optional(),
	price: Joi.number().optional().allow(null).precision(2).positive()
}).unknown(true);

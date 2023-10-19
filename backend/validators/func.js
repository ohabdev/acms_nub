const Joi = require('joi'); // Import Joi
// Define Joi schemas for validation
exports.createFunctionSchema = Joi.object({
	name: Joi.string().required(),
	path: Joi.string().required(),
	method: Joi.string().required()
}).unknown(true);

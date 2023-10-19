const Joi = require('joi'); // Import Joi
// Define Joi schemas for validation
exports.createMessageSchema = Joi.object({
	conversationId: Joi.number().required(),
	fromUserId: Joi.number().required(),
	message: Joi.string().required()
}).unknown(true);

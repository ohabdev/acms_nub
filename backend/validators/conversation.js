const Joi = require('joi'); // Import Joi

// Define Joi schemas for validation
exports.createConversationSchema = Joi.object({
	toUserId: Joi.number().required()
}).unknown(true);

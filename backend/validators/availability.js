const Joi = require('joi');

exports.createAvailabilitySchema = Joi.object({
	startTimeFrom: Joi.string(),
	toEndTime: Joi.string(),
	day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
	isAcceptInstantBooking: Joi.boolean().required()
}).unknown(true);

exports.updateAvailabilitySchema = Joi.object({
	startTimeFrom: Joi.string(),
	toEndTime: Joi.string(),
	day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').optional(),
	isAcceptInstantBooking: Joi.boolean().optional()
}).unknown(true);

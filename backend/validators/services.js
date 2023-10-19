const Joi = require('joi');

exports.createServiceSchema = Joi.object({
	serviceName: Joi.string().required(),
	availability: Joi.string().valid('in-person', 'remote-only', 'both').optional(),
	serviceTypeId: Joi.number().required(),
	subServiceTypeId: Joi.number().required(),
	countryId: Joi.number().required(),
	stateId: Joi.number().required(),
	countyId: Joi.number().optional().allow(null),
	cityId: Joi.number().required(),
	street: Joi.string().optional(),
	latitude: Joi.number().optional(),
	longitude: Joi.number().optional(),
	price: Joi.number().optional().required(),
	image: Joi.string().optional().allow(null)
});

exports.updateServiceSchema = Joi.object({
	serviceName: Joi.string().optional(),
	availability: Joi.string().valid('in-person', 'remote-only', 'both').optional(),
	serviceTypeId: Joi.number().optional(),
	subServiceTypeId: Joi.number().optional(),
	countryId: Joi.number().optional(),
	stateId: Joi.number().optional(),
	countyId: Joi.number().optional().allow(null),
	cityId: Joi.number().optional(),
	street: Joi.string().optional(),
	latitude: Joi.number().optional(),
	longitude: Joi.number().optional(),
	price: Joi.number().optional().optional(),
	image: Joi.string().optional().allow(null)
});

exports.searchServiceSchema = Joi.object({
	page: Joi.number().integer(),
	limit: Joi.number().integer(),
	q: Joi.string().optional(),
	serviceTypeIds: Joi.string(),
	subServiceTypeIds: Joi.string(),
	countryId: Joi.number().integer().positive(),
	countyId: Joi.number().integer().positive(),
	stateId: Joi.number().integer().positive(),
	cityId: Joi.number().integer().positive(),
	gender: Joi.string().valid('male', 'female', 'other')
}).unknown(true);

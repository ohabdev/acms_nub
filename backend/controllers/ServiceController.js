const { createServiceSchema, searchServiceSchema, updateServiceSchema } = require('../validators/services');
const apiResponse = require('../helpers/apiResponse');
const logger = require('../helpers/logger');
const { Op } = require('sequelize');
const {
	Service,
	ServiceType,
	Country,
	County,
	State,
	City,
	Provider,
	Review,
	User,
	Availability,
	Client,
	ProviderType,
	CityRate
} = require('../models');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new service
exports.create = async (req, res) => {
	const name = 'createService';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		const { value, error } = createServiceSchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const userId = req?.user?.id;
		const provider = await Provider.findOne({ where: { userId: userId } });
		if (!provider) {
			throw new Error('Provider not found');
		}
		value.providerId = provider.id;
		value.status = 'approved';
		value.createdBy = userId;
		const service = await Service.create(value);

		const serviceInfo = await Service.findByPk(service.id, {
			where: {
				isDeleted: false,
				providerId: provider?.id
			},
			include: [
				{
					model: ServiceType,
					as: 'serviceType'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city'
				}
			]
		});

		logger.info(`${fileName}->${name} Service successfully created and return object ${JSON.stringify(serviceInfo)}`);
		return apiResponse.successResponseWithData(res, 'Service successfully created', serviceInfo);
	} catch (err) {
		logger.error(`${fileName}->${name} Service not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all sub services by service ID
exports.getAllSubServicesById = async (req, res) => {
	const name = 'getAllSubServicesById';
	try {
		const parentId = req.params.id;
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		const services = await Service.findAndCountAll({
			where: {
				isDeleted: false,
				parentId: parentId
			},
			include: [
				{
					model: ServiceType,
					as: 'serviceType'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						},
						{
							model: Review,
							as: 'reviews'
						}
					]
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(services)}`);
		return apiResponse.successResponseWithData(res, 'Services successfully fetched', services);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get all sub services
exports.getAllSubServices = async (req, res) => {
	const name = 'getAllSubServices';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		const services = await Service.findAndCountAll({
			where: {
				isDeleted: false,
				parentId: { [Op.ne]: null }
			},
			include: [
				{
					model: ServiceType,
					as: 'serviceType'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						},
						{
							model: Review,
							as: 'reviews'
						}
					]
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(services)}`);
		return apiResponse.successResponseWithData(res, 'Services successfully fetched', services);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get all services
exports.getAllServices = async (req, res) => {
	const name = 'getAllServices';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		const services = await Service.findAndCountAll({
			where: {
				isDeleted: false
			},
			include: [
				{
					model: ServiceType,
					as: 'serviceType'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city'
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(services)}`);
		return apiResponse.successResponseWithData(res, 'Services successfully fetched', services);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

//My services this api for provider
exports.myServices = async (req, res) => {
	const name = 'myServices';
	try {
		if (!req?.user?.id) {
			throw new Error('Invalid user');
		}
		const provider = await Provider.findOne({
			where: {
				userId: req?.user?.id
			}
		});
		if (!provider) {
			throw new Error('Invalid user');
		}
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		const services = await Service.findAndCountAll({
			where: {
				isDeleted: false,
				providerId: provider?.id
			},
			include: [
				{
					model: ServiceType,
					as: 'serviceType'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city',
					include: [
						{
							model: CityRate,
							as: 'cityRate'
						}
					]
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(services)}`);
		return apiResponse.successResponseWithData(res, 'Services successfully fetched', services);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

//provider services, this api for client view
exports.providerServices = async (req, res) => {
	const name = 'providerServices';
	try {
		if (!req?.params?.id) {
			throw new Error('Invalid user');
		}
		const provider = await Provider.findOne({
			where: {
				id: req?.params?.id
			}
		});
		if (!provider) {
			throw new Error('Invalid user');
		}
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		const services = await Service.findAndCountAll({
			where: {
				isDeleted: false,
				status: 'approved',
				isActive: true,
				providerId: provider?.id
			},
			include: [
				{
					model: ServiceType,
					as: 'serviceType'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city'
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(services)}`);
		return apiResponse.successResponseWithData(res, 'Services successfully fetched', services);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single service by ID
exports.getSingleService = async (req, res) => {
	const name = 'getSingleService';
	try {
		const service = await Service.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			},
			include: [
				{
					model: ServiceType,
					as: 'serviceType'
				},
				{
					model: Country,
					as: 'country'
				},
				{
					model: County,
					as: 'county'
				},
				{
					model: State,
					as: 'state'
				},
				{
					model: City,
					as: 'city'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						},
						{
							model: Availability,
							as: 'availability'
						},
						{
							model: Review,
							as: 'reviews',
							include: [
								{
									model: Client,
									as: 'client',
									include: [
										{
											model: User,
											as: 'user'
										}
									]
								}
							]
						}
					]
				}
			]
		});
		if (!service) {
			throw new Error('Service not found');
		} else {
			logger.info(`${fileName}->${name} Service successfully fetched for ID ${req.params.id}, data=${JSON.stringify(service)}`);
			return apiResponse.successResponseWithData(res, 'Service successfully fetched', service);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// search services
exports.searchServices = async (req, res) => {
	const name = 'searchServices';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;

		const { value, error } = searchServiceSchema.validate(req.query);
		if (error) {
			throw new Error(error.message);
		}

		const query = {
			isDeleted: false
			// status: 'approved'
		};

		let serviceTypeIds = [];
		let subServiceTypeIds = [];

		if (value.serviceTypeIds) {
			serviceTypeIds = value.serviceTypeIds.split(',').map(Number);
		}

		if (value.subServiceTypeIds) {
			subServiceTypeIds = value.subServiceTypeIds.split(',').map(Number);
		}

		if (serviceTypeIds.length > 0 && subServiceTypeIds.length == 0) {
			query[Op.or] = [{ serviceTypeId: { [Op.in]: serviceTypeIds } }];
		} else if (subServiceTypeIds.length > 0 && serviceTypeIds.length == 0) {
			query[Op.or] = [{ subServiceTypeId: { [Op.in]: subServiceTypeIds } }];
		} else if (serviceTypeIds.length > 0 && subServiceTypeIds.length > 0) {
			query[Op.and] = [{ serviceTypeId: { [Op.in]: serviceTypeIds } }, { subServiceTypeId: { [Op.in]: subServiceTypeIds } }];
		}

		if (value.countryId) {
			query.countryId = value.countryId;
		}

		if (value.countyId) {
			query.countyId = value.countyId;
		}

		if (value.stateId) {
			query.stateId = value.stateId;
		}

		if (value.cityId) {
			query.cityId = value.cityId;
		}

		if (value.q) {
			query[Op.or] = [
				{
					serviceName: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					street: {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					'$serviceType.name$': {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					'$country.name$': {
						[Op.like]: `%${value.q}%`
					}
				},
				// {
				// 	'$county.name$': {
				// 		[Op.like]: `%${value.q}%`
				// 	}
				// },
				{
					'$state.name$': {
						[Op.like]: `%${value.q}%`
					}
				},
				{
					'$city.name$': {
						[Op.like]: `%${value.q}%`
					}
				}
				// {
				// 	'$provider.licenseInformation$': {
				// 		[Op.like]: `%${value.q}%`
				// 	}
				// }
			];
		}
		let userFilters = {};
		if (value?.gender) {
			userFilters = {
				where: {
					gender: value?.gender
				}
			};
		}

		const queryParams = {
			distinct: true,
			where: query,
			include: [
				{
					model: ServiceType,
					as: 'serviceType',
					required: true
				},
				{
					model: Country,
					as: 'country',
					required: true
				},
				{
					model: County,
					as: 'county',
					required: false
				},
				{
					model: State,
					as: 'state',
					required: true
				},
				{
					model: City,
					as: 'city',
					required: true,
					include: [
						{
							model: CityRate,
							as: 'cityRate'
						}
					]
				},
				{
					model: Provider,
					as: 'provider',
					required: true,
					include: [
						{
							model: User,
							as: 'user',
							...userFilters
						},
						{
							model: Review,
							as: 'reviews',
							where: {
								userType: 'client'
							},
							include: [
								{
									model: Client,
									as: 'client',
									include: [
										{
											model: User,
											as: 'user'
										}
									]
								}
							],
							required: false
						},
						{
							model: ProviderType,
							as: 'providerType'
						}
					]
				}
			],
			offset,
			limit,
			order: [['id', 'DESC']]
		};
		const servicesRows = await Service.findAll(queryParams);
		const count = await Service.count(queryParams);

		const services = {
			count: count,
			rows: servicesRows
		};

		return apiResponse.successResponseWithData(res, 'Service search results', services);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a service by ID
exports.update = async (req, res) => {
	const name = 'updateService';
	try {
		const service = await Service.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!service) {
			throw new Error('Service not found');
		} else {
			const { value, error } = updateServiceSchema.validate(req.body);
			if (error) {
				throw new Error(error.message);
			}
			value.updatedBy = req?.user?.id;
			await service.update(value);
			const serviceInfo = await Service.findByPk(service.id, {
				where: {
					isDeleted: false,
					providerId: service.providerId
				},
				include: [
					{
						model: ServiceType,
						as: 'serviceType'
					},
					{
						model: Country,
						as: 'country'
					},
					{
						model: County,
						as: 'county'
					},
					{
						model: State,
						as: 'state'
					},
					{
						model: City,
						as: 'city'
					}
				]
			});
			logger.info(`${fileName}->${name} Service successfully updated and return object ${JSON.stringify(serviceInfo)}`);
			return apiResponse.successResponseWithData(res, 'Service successfully updated', serviceInfo);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Service not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a service by ID
exports.delete = async (req, res) => {
	const name = 'deleteService';
	try {
		const service = await Service.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!service) {
			throw new Error('Service not found');
		} else {
			await service.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} Service successfully deleted and return object ${JSON.stringify(service)}`);
			return apiResponse.successResponseWithData(res, 'Service successfully deleted', service);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Service not deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

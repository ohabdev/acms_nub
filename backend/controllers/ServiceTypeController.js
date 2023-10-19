const { createServiceTypeSchema } = require('../validators/serviceType');
const { generateSlug } = require('../helpers/utility');
const { ServiceType, Category } = require('../models');
const apiResponse = require('../helpers/apiResponse');
const logger = require('../helpers/logger');
const { Op } = require('sequelize');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new service type
exports.create = async (req, res) => {
	const name = 'createServiceType';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		req.body.createdBy = req?.user?.id;
		const { value, error } = createServiceTypeSchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const checkedServiceType = await ServiceType.findOne({ where: { name: value.name } });

		if (checkedServiceType) {
			return apiResponse.validationErrorWithData(res, 'Service type already exists');
		}

		value.slug = generateSlug(value.name);
		const serviceType = await ServiceType.create(value);
		logger.info(`${fileName}->${name} Service type successfully created and return object ${JSON.stringify(serviceType)}`);
		return apiResponse.successResponseWithData(res, 'Service type successfully created', serviceType);
	} catch (err) {
		logger.error(`${fileName}->${name} Service type not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all service types
exports.getAllServiceTypes = async (req, res) => {
	const name = 'getAllServiceTypes';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);
		const query = {
			isDeleted: false,
			parentId: { [Op.eq]: null }
		};
		if (req.query.categoryId) {
			query.categoryId = { [Op.eq]: req.query.categoryId };
		}
		const serviceTypes = await ServiceType.findAndCountAll({
			where: query,
			limit,
			offset,
			include: [
				{
					model: Category,
					as: 'category'
				}
			],
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(serviceTypes)}`);
		return apiResponse.successResponseWithData(res, 'Service types successfully fetched', serviceTypes);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get all service types by service id
exports.getAllSubServiceTypesById = async (req, res) => {
	const name = 'getAllSubServiceTypesById';
	try {
		const parentId = req.params.id;
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);
		const serviceTypes = await ServiceType.findAndCountAll({
			where: {
				isDeleted: false,
				parentId: parentId
			},
			include: [
				{
					model: Category,
					as: 'category'
				},
				{
					model: ServiceType,
					as: 'parent',
					required: false
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(serviceTypes)}`);
		return apiResponse.successResponseWithData(res, 'Service types successfully fetched', serviceTypes);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};
// Get all sub service types
exports.getAllSubServiceTypes = async (req, res) => {
	const name = 'getAllServiceTypes';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);

		const query = {
			isDeleted: false
		};

		if (req.query.categoryId) {
			query.categoryId = { [Op.eq]: req.query.categoryId };
		}
		if (req.query.parentId) {
			query.parentId = { [Op.eq]: req.query.parentId };
		} else {
			query.parentId = { [Op.ne]: null };
		}

		const serviceTypes = await ServiceType.findAndCountAll({
			where: query,
			include: [
				{
					model: Category,
					as: 'category'
				},
				{
					model: ServiceType,
					as: 'parent',
					required: false
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(serviceTypes)}`);
		return apiResponse.successResponseWithData(res, 'Service types successfully fetched', serviceTypes);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single service type by ID
exports.getSingleServiceType = async (req, res) => {
	const name = 'getSingleServiceType';
	try {
		const serviceType = await ServiceType.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			},
			include: [
				{
					model: Category,
					as: 'category'
				},
				{
					model: ServiceType,
					as: 'parent',
					required: false
				}
			]
		});
		if (!serviceType) {
			throw new Error('Service type not found');
		} else {
			logger.info(`${fileName}->${name} Service type successfully fetched for ID ${req.params.id}, data=${JSON.stringify(serviceType)}`);
			return apiResponse.successResponseWithData(res, 'Service type successfully fetched', serviceType);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a service type by ID
exports.update = async (req, res) => {
	const name = 'updateServiceType';
	try {
		const serviceType = await ServiceType.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!serviceType) {
			throw new Error('Service type not found');
		} else {
			req.body.updatedBy = req?.user?.id;
			await serviceType.update(req.body);
			logger.info(`${fileName}->${name} Service type successfully updated and return object ${JSON.stringify(serviceType)}`);
			return apiResponse.successResponseWithData(res, 'Service type successfully updated', serviceType);
		}
	} catch (err) {
		if (err?.errors?.length > 0 && err?.errors[0]?.message) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Service type not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a service type by ID
exports.delete = async (req, res) => {
	const name = 'deleteServiceType';
	try {
		const serviceType = await ServiceType.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!serviceType) {
			throw new Error('Service type not found');
		} else {
			await serviceType.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} Service type successfully deleted and return object ${JSON.stringify(serviceType)}`);
			return apiResponse.successResponseWithData(res, 'Service type successfully deleted', serviceType);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Service type not deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

//hard delete a service type by ID
exports.hardDelete = async (req, res) => {
	const name = 'hardDelete';
	try {
		const serviceType = await ServiceType.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!serviceType) {
			throw new Error('Service type not found');
		} else {
			await serviceType.destroy();
			logger.info(`${fileName}->${name} Service type successfully deleted and return object ${JSON.stringify(serviceType)}`);
			return apiResponse.successResponseWithData(res, 'Service type successfully deleted', serviceType);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Service type not deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

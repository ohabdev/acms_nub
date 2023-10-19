const { createCityRateSchema, updateCityRateSchema, searchCityRateSchema } = require('../validators/cityRate');
const apiResponse = require('../helpers/apiResponse');
const { CityRate, City } = require('../models');
const logger = require('../helpers/logger');
const { Op } = require('sequelize');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new city rate
exports.create = async (req, res) => {
	const name = 'createCityRate';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		req.body.createdBy = req?.user?.id;

		const validate = createCityRateSchema.validate(req.body);
		if (validate.error) {
			throw new Error(validate.error);
		}

		const cityRate = await CityRate.create(validate.value);

		logger.info(`${fileName}->${name} CityRate successfully created and return object ${JSON.stringify(cityRate)}`);
		return apiResponse.successResponseWithData(res, 'CityRate successfully created', cityRate);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} CityRate not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all city rates
exports.getAllCityRates = async (req, res) => {
	const name = 'getAllCityRates';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit = ${limit} and offset = ${offset} for fetch data from database`);

		const query = {
			isDeleted: false
		};

		if (req.query.cityId) {
			query.cityId = req?.query?.cityId;
		}

		const { value, error } = searchCityRateSchema.validate(req.query);
		if (error) {
			throw new Error(error.message);
		}

		if (value?.q) {
			query.name = {
				[Op.like]: `%${value.q}%`
			};
		}

		const cityRates = await CityRate.findAndCountAll({
			where: query,
			limit,
			offset,
			include: [
				{
					model: City,
					as: 'city'
				}
			],
			order: [['createdAt', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(cityRates)}`);
		return apiResponse.successResponseWithData(res, 'CityRates successfully fetched', cityRates);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single city rate by ID
exports.getSingleCityRate = async (req, res) => {
	const name = 'getSingleCityRate';
	try {
		const cityRate = await CityRate.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			},
			include: [
				{
					model: City,
					as: 'city'
				}
			]
		});
		if (!cityRate) {
			throw new Error('CityRate not found');
		} else {
			logger.info(`${fileName}->${name} CityRate successfully fetched for ID ${req.params.id}, data=${JSON.stringify(cityRate)}`);
			return apiResponse.successResponseWithData(res, 'CityRate successfully fetched', cityRate);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a city rate by ID
exports.update = async (req, res) => {
	const name = 'updateCityRate';
	try {
		const cityRate = await CityRate.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!cityRate) {
			throw new Error('CityRate not found');
		} else {
			req.body.updatedBy = req?.user?.id;
			const validate = updateCityRateSchema.validate(req.body);
			if (validate.error) {
				throw new Error(validate.error);
			}

			const updatedCityRate = await cityRate.update(validate.value);
			logger.info(`${fileName}->${name} CityRate successfully updated and return object ${JSON.stringify(updatedCityRate)}`);
			return apiResponse.successResponseWithData(res, 'CityRate successfully updated', updatedCityRate);
		}
	} catch (err) {
		if (err?.errors?.length > 0 && err?.errors[0]?.message) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} CityRate not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a city rate by ID
exports.delete = async (req, res) => {
	const name = 'deleteCityRate';
	try {
		const cityRate = await CityRate.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!cityRate) {
			throw new Error('CityRate not found');
		} else {
			const deletedCityRate = await cityRate.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);

			logger.info(`${fileName}->${name} CityRate successfully deleted and return object ${JSON.stringify(deletedCityRate)}`);
			return apiResponse.successResponseWithData(res, 'CityRate successfully deleted', deletedCityRate);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} CityRate not deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Hard delete a city rate by ID
exports.hardDelete = async (req, res) => {
	const name = 'hardDeleteCityRate';
	try {
		const cityRate = await CityRate.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!cityRate) {
			throw new Error('CityRate not found');
		} else {
			const deletedCityRate = await cityRate.destroy();
			logger.info(`${fileName}->${name} CityRate successfully hard deleted and return object ${JSON.stringify(deletedCityRate)}`);
			return apiResponse.successResponseWithData(res, 'CityRate successfully hard deleted', deletedCityRate);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} CityRate not hard deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

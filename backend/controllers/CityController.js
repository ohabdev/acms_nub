const { createCitySchema, updateCitySchema, searchCitySchema } = require('../validators/city');
const apiResponse = require('../helpers/apiResponse');
const { City, State } = require('../models');
const logger = require('../helpers/logger');

const path = require('path');
const { Op } = require('sequelize');
const fileName = path.basename(__filename);

// Create a new city
exports.create = async (req, res) => {
	const name = 'createCity';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		req.body.createdBy = req?.user?.id;
		const validate = createCitySchema.validate(req.body);
		if (validate.error) {
			throw new Error(validate.error);
		}
		const city = await City.create(validate.value);
		logger.info(`${fileName}->${name} City successfully created and return object ${JSON.stringify(city)}`);
		return apiResponse.successResponseWithData(res, 'City successfully created', city);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} City successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all cities
exports.getAllCities = async (req, res) => {
	const name = 'getAllCities';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);

		const query = {
			isDeleted: false
		};

		if (req.query.stateId) {
			query.stateId = req?.query?.stateId;
		}
		if (req.query.countryId) {
			query.countryId = req?.query?.countryId;
		}
		if (req.query.countyId) {
			query.countyId = req?.query?.countyId;
		}
		const { value, error } = searchCitySchema.validate(req.query);

		if (error) {
			throw new Error(error.message);
		}
		if (value?.q) {
			query.name = {
				[Op.like]: `%${value.q}%`
			};
		}
		const cities = await City.findAndCountAll({
			where: query,
			limit,
			offset,
			include: [
				{
					model: State,
					as: 'state'
				}
			],
			order: [['createdAt', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(cities)}`);
		return apiResponse.successResponseWithData(res, 'Cities successfully fetched', cities);
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single city by ID
exports.getSingleCity = async (req, res) => {
	const name = 'getSingleCity';
	try {
		const city = await City.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			},
			include: [
				{
					model: State,
					as: 'state'
				}
			]
		});
		if (!city) {
			throw new Error('City not found');
		} else {
			logger.info(`${fileName}->${name} City successfully fetched for ${req.params.id} this ID data=${JSON.stringify(city)}`);
			return apiResponse.successResponseWithData(res, 'City successfully fetched', city);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a city by ID
exports.update = async (req, res) => {
	const name = 'updateCity';
	try {
		const city = await City.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!city) {
			throw new Error('City not found');
		} else {
			req.body.updatedBy = req?.user?.id;
			const validate = updateCitySchema.validate(req.body);
			if (validate.error) {
				throw new Error(validate.error);
			}
			const updateCity = await city.update(validate.value);
			logger.info(`${fileName}->${name} City successfully updated and return object ${JSON.stringify(updateCity)}`);
			return apiResponse.successResponseWithData(res, 'City successfully updated', updateCity);
		}
	} catch (err) {
		if (err?.errors?.length > 0 && err?.errors[0]?.message) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} City successfully not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a city by ID
exports.delete = async (req, res) => {
	const name = 'deleteCity';
	try {
		const city = await City.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!city) {
			throw new Error('City not found');
		} else {
			const deletedCity = await city.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} City successfully deleted and return object ${JSON.stringify(deletedCity)}`);
			return apiResponse.successResponseWithData(res, 'City successfully deleted', deletedCity);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} City successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// hard delete a city by ID
exports.hardDelete = async (req, res) => {
	const name = 'deleteCity';
	try {
		const city = await City.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!city) {
			throw new Error('City not found');
		} else {
			const deletedCity = await city.destroy();
			logger.info(`${fileName}->${name} City successfully deleted and return object ${JSON.stringify(deletedCity)}`);
			return apiResponse.successResponseWithData(res, 'City successfully deleted', deletedCity);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} City successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

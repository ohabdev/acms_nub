const { Country } = require('../models'); // Assuming your Country model is in the 'models' folder
const apiResponse = require('../helpers/apiResponse');
const path = require('path');
const { createCountrySchema, searchCountrySchema } = require('../validators/country'); // You should create a validator for the country model
const fileName = path.basename(__filename);
const logger = require('../helpers/logger');
const { Op } = require('sequelize');
// Create a new country
exports.create = async (req, res) => {
	const name = 'createCountry';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		req.body.createdBy = req?.user?.id;
		const { error } = createCountrySchema.validate(req.body);
		if (error) {
			throw new Error(error);
		}
		const country = await Country.create(req.body);
		logger.info(`${fileName}->${name} Country successfully created and return object ${JSON.stringify(country)}`);
		return apiResponse.successResponseWithData(res, 'Country successfully created', country);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Country successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all countries
exports.getAllCountries = async (req, res) => {
	const name = 'getAllCountries';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);
		const { value, error } = searchCountrySchema.validate(req.query);
		if (error) {
			throw new Error(error.message);
		}
		const searchCondition = {};
		if (value?.q) {
			searchCondition.name = {
				[Op.like]: `%${value.q}%`
			};
		}
		const countries = await Country.findAndCountAll({
			where: {
				isDeleted: false,
				...searchCondition
			},
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(countries)}`);
		return apiResponse.successResponseWithData(res, 'Countries successfully fetched', countries);
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single country by ID
exports.getSingleCountry = async (req, res) => {
	const name = 'getSingleCountry';
	try {
		const country = await Country.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!country) {
			throw new Error('Country not found');
		} else {
			logger.info(`${fileName}->${name} Country successfully fetched for ${req.params.id} this ID data=${JSON.stringify(country)}`);
			return apiResponse.successResponseWithData(res, 'Country successfully fetched', country);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a country by ID
exports.update = async (req, res) => {
	const name = 'updateCountry';
	try {
		const country = await Country.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!country) {
			throw new Error('Country not found');
		} else {
			req.body.updatedBy = req?.user?.id;
			await country.update(req.body);
			logger.info(`${fileName}->${name} Country successfully updated and return object ${JSON.stringify(country)}`);
			return apiResponse.successResponseWithData(res, 'Country successfully updated', country);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Country successfully not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a country by ID
exports.delete = async (req, res) => {
	const name = 'deleteCountry';
	try {
		const country = await Country.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!country) {
			throw new Error('Country not found');
		} else {
			await country.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} Country successfully deleted and return object ${JSON.stringify(country)}`);
			return apiResponse.successResponseWithData(res, 'Country successfully deleted', country);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Country successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

//Hard Delete a country by ID
exports.hardDelete = async (req, res) => {
	const name = 'hardDelete';
	try {
		const country = await Country.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!country) {
			throw new Error('Country not found');
		} else {
			await country.destroy();
			logger.info(`${fileName}->${name} Country successfully deleted and return object ${JSON.stringify(country)}`);
			return apiResponse.successResponseWithData(res, 'Country successfully deleted', country);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Country successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

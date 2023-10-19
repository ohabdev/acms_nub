const { State, Country } = require('../models'); // Assuming your State and Country models are in the 'models' folder
const apiResponse = require('../helpers/apiResponse');
const path = require('path');
const { createStateSchema, searchStateSchema } = require('../validators/state'); // You should create a validator for the state model
const fileName = path.basename(__filename);
const logger = require('../helpers/logger');
const { Op } = require('sequelize');

// Create a new state
exports.create = async (req, res) => {
	const name = 'createState';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		req.body.createdBy = req?.user?.id;
		const { error } = createStateSchema.validate(req.body);
		if (error) {
			throw new Error(error);
		}
		const state = await State.create(req.body);
		logger.info(`${fileName}->${name} State successfully created and return object ${JSON.stringify(state)}`);
		return apiResponse.successResponseWithData(res, 'State successfully created', state);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} State successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all states
exports.getAllStates = async (req, res) => {
	const name = 'getAllStates';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);

		const query = {
			isDeleted: false
		};
		if (req.query.countryId) {
			query.countryId = req?.query?.countryId;
		}
		const { value, error } = searchStateSchema.validate(req.query);
		if (error) {
			throw new Error(error.message);
		}

		if (value?.q) {
			query.name = {
				[Op.like]: `%${value.q}%`
			};
		}
		const states = await State.findAndCountAll({
			where: query,
			include: [
				{
					model: Country,
					as: 'country'
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(states)}`);
		return apiResponse.successResponseWithData(res, 'States successfully fetched', states);
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single state by ID
exports.getSingleState = async (req, res) => {
	const name = 'getSingleState';
	try {
		const state = await State.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			},
			include: [
				{
					model: Country,
					as: 'country'
				}
			]
		});
		if (!state) {
			throw new Error('State not found');
		} else {
			logger.info(`${fileName}->${name} State successfully fetched for ${req.params.id} this ID data=${JSON.stringify(state)}`);
			return apiResponse.successResponseWithData(res, 'State successfully fetched', state);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a state by ID
exports.update = async (req, res) => {
	const name = 'updateState';
	try {
		const state = await State.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!state) {
			throw new Error('State not found');
		} else {
			req.body.updatedBy = req?.user?.id;
			await state.update(req.body);
			logger.info(`${fileName}->${name} State successfully updated and return object ${JSON.stringify(state)}`);
			return apiResponse.successResponseWithData(res, 'State successfully updated', state);
		}
	} catch (err) {
		if (err?.errors?.length > 0 && err?.errors[0]?.message) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} State successfully not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a state by ID
exports.delete = async (req, res) => {
	const name = 'deleteState';
	try {
		const state = await State.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!state) {
			throw new Error('State not found');
		} else {
			await state.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} State successfully deleted and return object ${JSON.stringify(state)}`);
			return apiResponse.successResponseWithData(res, 'State successfully deleted', state);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} State successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Hard Delete a state by ID
exports.hardDelete = async (req, res) => {
	const name = 'deleteState';
	try {
		const state = await State.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!state) {
			throw new Error('State not found');
		} else {
			await state.destroy();
			logger.info(`${fileName}->${name} State successfully deleted and return object ${JSON.stringify(state)}`);
			return apiResponse.successResponseWithData(res, 'State successfully deleted', state);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} State successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

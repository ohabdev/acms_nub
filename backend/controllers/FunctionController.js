const { Function } = require('../models'); // Adjust the path as needed
const apiResponse = require('../helpers/apiResponse');
const path = require('path');
const fileName = path.basename(__filename);
const logger = require('../helpers/logger');
const { createFunctionSchema } = require('../validators/func');
// Create a new function
exports.create = async (req, res) => {
	const functionName = 'create';
	try {
		logger.info(`${fileName}->${functionName}  function get data from client ${JSON.stringify(req.body)}`);
		const { error, value } = createFunctionSchema.validate(req.body);
		if (error) {
			throw new Error(error);
		}
		value.createdBy = req?.user?.id;
		const func = await Function.create(value);
		logger.info(`${fileName}->${functionName} Function successfully created and return object ${JSON.stringify(func)}`);
		return apiResponse.successResponseWithData(res, 'Function successfully created', func);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${functionName} Function successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all functions
exports.getAllFunctions = async (req, res) => {
	const name = 'getAllFunctions';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);

		const functions = await Function.findAndCountAll({
			where: {
				isDeleted: false
			},
			limit,
			offset,
			order: [['name', 'ASC']]
		});
		logger.info(`${fileName}->${name} data successfully fetched ${JSON.stringify(functions)}`);
		return apiResponse.successResponseWithData(res, 'Data successfully fetched', functions);
	} catch (err) {
		logger.error(`${fileName}->${name} Data not found and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a function by ID
exports.getFunctionById = async (req, res) => {
	const name = 'getFunctionById';
	const functionId = req.params.id;
	try {
		const func = await Function.findOne({
			where: {
				id: functionId,
				isDeleted: false
			}
		});
		if (!func) {
			throw new Error('Function not found');
		} else {
			logger.info(`${fileName}->${name} data successfully fetched ${JSON.stringify(func)}`);
			return apiResponse.successResponseWithData(res, 'Data successfully fetched', func);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Data not found and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update a function by ID
exports.update = async (req, res) => {
	const functionId = req.params.id;
	const functionName = 'update';
	try {
		logger.info(`${fileName}->${functionName}  function get data from client ${JSON.stringify(req.body)}`);
		const { error, value } = createFunctionSchema.validate(req.body);
		if (error) {
			throw new Error(error);
		}

		const func = await Function.findOne({
			where: {
				id: functionId,
				isDeleted: false
			}
		});
		if (!func) {
			throw new Error('Function not found');
		} else {
			value.updatedBy = req.user.id;
			await func.update(value);
			logger.info(`${fileName}->${functionName} Function successfully updated and return object ${JSON.stringify(func)}`);
			return apiResponse.successResponseWithData(res, 'Function successfully updated', func);
		}
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${functionName} Data not found and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a function by ID
exports.delete = async (req, res) => {
	const functionId = req.params.id;
	const name = 'delete';
	try {
		const func = await Function.findOne({
			where: {
				id: functionId,
				isDeleted: false
			}
		});
		if (!func) {
			throw new Error('Function not found');
		} else {
			await func.update({ isDeleted: true });
			logger.info(`${fileName}->${name} Function successfully updated and return object ${JSON.stringify(func)}`);
			return apiResponse.successResponseWithData(res, 'Function successfully deleted', func);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Data not found and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.hardDelete = async (req, res) => {
	const name = 'delete';
	try {
		const func = await Function.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!func) {
			throw new Error('Function not found');
		} else {
			await func.destroy();

			logger.info(`${fileName}->${name} Function successfully hard deleted and return object ${JSON.stringify(func)}`);
			return apiResponse.successResponseWithData(res, 'Function successfully hard deleted', func);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Function not hard deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

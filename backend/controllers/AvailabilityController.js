const { createAvailabilitySchema, updateAvailabilitySchema } = require('../validators/availability');
const { Availability, Provider } = require('../models');
const apiResponse = require('../helpers/apiResponse');
const logger = require('../helpers/logger');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new availability
exports.create = async (req, res) => {
	const name = 'createAvailability';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		const { value, error } = createAvailabilitySchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const userId = req?.user?.id;

		const provider = await Provider.findOne({ userId: userId });
		if (!provider) {
			throw new Error('Provider not found');
		}

		value.providerId = provider.id;
		await Availability.create(value);
		const availabilities = await Availability.findAndCountAll({ providerId: provider.id });
		logger.info(`${fileName}->${name} Availability successfully created and return object ${JSON.stringify(availabilities)}`);
		return apiResponse.successResponseWithData(res, 'Availability successfully created', availabilities);
	} catch (err) {
		logger.error(`${fileName}->${name} Availability not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all availabilities
exports.getAllAvailabilities = async (req, res) => {
	const name = 'getAllAvailabilities';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;

		const userId = req?.user?.id;
		const provider = await Provider.findOne({ userId: userId });

		if (!provider) {
			throw new Error('Provider not found');
		}

		const query = {
			providerId: provider?.id
		};

		const availabilities = await Availability.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Availabilities successfully fetched from database ${JSON.stringify(availabilities)}`);
		return apiResponse.successResponseWithData(res, 'Availabilities successfully fetched', availabilities);
	} catch (error) {
		logger.error(`${fileName}->${name} Availabilities not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single availability by ID
exports.getSingleAvailability = async (req, res) => {
	const name = 'getSingleAvailability';
	try {
		const userId = req?.user?.id;
		const provider = await Provider.findOne({ userId: userId });

		if (!provider) {
			throw new Error('Provider not found');
		}

		const availability = await Availability.findOne({
			where: {
				id: req.params.id,
				providerId: provider.id
			}
		});
		if (!availability) {
			throw new Error('Availability not found');
		} else {
			logger.info(`${fileName}->${name} Availability successfully fetched for ${req.params.id} this ID data=${JSON.stringify(availability)}`);
			return apiResponse.successResponseWithData(res, 'Availability successfully fetched', availability);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Availability not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update an availability by ID
exports.update = async (req, res) => {
	const name = 'updateAvailability';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const { value, error } = updateAvailabilitySchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const userId = req?.user?.id;
		const provider = await Provider.findOne({ userId: userId });

		if (!provider) {
			throw new Error('Provider not found');
		}

		const availability = await Availability.findOne({
			where: {
				id: req.params.id,
				providerId: provider.id
			}
		});

		if (!availability) {
			throw new Error('Availability not found');
		} else {
			await availability.update(value);
			logger.info(`${fileName}->${name} Availability successfully updated and return object ${JSON.stringify(availability)}`);
			return apiResponse.successResponseWithData(res, 'Availability successfully updated', availability);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Availability not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete an availability by ID
exports.delete = async (req, res) => {
	const name = 'deleteAvailability';
	try {
		const userId = req?.user?.id;
		const provider = await Provider.findOne({ userId: userId });

		if (!provider) {
			throw new Error('Provider not found');
		}

		const availability = await Availability.findOne({
			where: {
				id: req.params.id,
				providerId: provider.id
			}
		});
		if (!availability) {
			throw new Error('Availability not found');
		} else {
			await availability.destroy();
			logger.info(`${fileName}->${name} Availability successfully deleted`);
			return apiResponse.successResponse(res, 'Availability successfully deleted');
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Availability not deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

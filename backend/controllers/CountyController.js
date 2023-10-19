const path = require('path');
const fileName = path.basename(__filename);

const { createCountySchema, updateCountySchema, searchCountySchema } = require('../validators/county');
const apiResponse = require('../helpers/apiResponse');
const { County, State } = require('../models');
const logger = require('../helpers/logger');
const { Op } = require('sequelize');

// Create a new county
exports.create = async (req, res) => {
	const name = 'createCounty';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		req.body.createdBy = req?.user?.id;
		const validate = createCountySchema.validate(req.body);
		if (validate.error) {
			throw new Error(validate.error);
		}
		const county = await County.create(validate.value);
		logger.info(`${fileName}->${name} County successfully created and return object ${JSON.stringify(county)}`);
		return apiResponse.successResponseWithData(res, 'County successfully created', county);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} County successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all counties
exports.getAllCounties = async (req, res) => {
	const name = 'getAllCounties';
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
		const { value, error } = searchCountySchema.validate(req.query);
		if (error) {
			throw new Error(error.message);
		}

		if (value?.q) {
			query.name = {
				[Op.like]: `%${value.q}%`
			};
		}
		const counties = await County.findAndCountAll({
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
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(counties)}`);
		return apiResponse.successResponseWithData(res, 'Counties successfully fetched', counties);
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single county by ID
exports.getSingleCounty = async (req, res) => {
	const name = 'getSingleCounty';
	try {
		const county = await County.findOne({
			where: {
				isDeleted: false,
				isActive: true,
				id: req.params.id
			},
			include: [
				{
					model: State,
					as: 'state'
				}
			]
		});
		if (!county) {
			throw new Error('County not found');
		} else {
			logger.info(`${fileName}->${name} County successfully fetched for ${req.params.id} this ID data=${JSON.stringify(county)}`);
			return apiResponse.successResponseWithData(res, 'County successfully fetched', county);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a county by ID
exports.update = async (req, res) => {
	const name = 'updateCounty';
	try {
		const county = await County.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!county) {
			throw new Error('County not found');
		} else {
			req.body.updatedBy = req?.user?.id;
			const validate = updateCountySchema.validate(req.body);
			if (validate.error) {
				throw new Error(validate.error);
			}
			const updateCounty = await county.update(validate.value);
			logger.info(`${fileName}->${name} County successfully updated and return object ${JSON.stringify(updateCounty)}`);
			return apiResponse.successResponseWithData(res, 'County successfully updated', updateCounty);
		}
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} County successfully not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a county by ID
exports.delete = async (req, res) => {
	const name = 'deleteCounty';
	try {
		const county = await County.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!county) {
			throw new Error('County not found');
		} else {
			await County.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} County successfully deleted and return object ${JSON.stringify(county)}`);
			return apiResponse.successResponseWithData(res, 'County successfully deleted', county);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} County successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

//Hard Delete a County by ID
exports.hardDelete = async (req, res) => {
	const name = 'hardDelete';
	try {
		const county = await County.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!County) {
			throw new Error('Country not found');
		} else {
			await county.destroy();
			logger.info(`${fileName}->${name} County successfully deleted and return object ${JSON.stringify(county)}`);
			return apiResponse.successResponseWithData(res, 'County successfully deleted', county);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} County successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

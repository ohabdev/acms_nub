const { Category } = require('../models'); // Assuming your Category model is in the 'models' folder
const apiResponse = require('../helpers/apiResponse');
const path = require('path');
const { createCategorySchema, searchCategorySchema } = require('../validators/category');
const fileName = path.basename(__filename);
const logger = require('../helpers/logger');
const { Op } = require('sequelize');
// Create a new category
exports.create = async (req, res) => {
	const name = 'create';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		req.body.createdBy = req?.user?.id;
		const { error } = createCategorySchema.validate(req.body);
		if (error) {
			throw new Error(error);
		}
		const category = await Category.create(req.body);
		logger.info(`${fileName}->${name} Category successfully created and return object ${JSON.stringify(category)}`);
		return apiResponse.successResponseWithData(res, 'Category successfully created', category);
	} catch (err) {
		if (err?.errors[0]?.message) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Category successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all categories
exports.getAllCategories = async (req, res) => {
	const name = 'getAllCategories';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);

		const { value, error } = searchCategorySchema.validate(req.query);

		if (error) {
			throw new Error(error.message);
		}
		const query = {};
		if (value?.q) {
			query.name = {
				[Op.like]: `%${value.q}%`
			};
		}
		const categories = await Category.findAndCountAll({
			where: {
				isDeleted: false,
				...query
			},
			limit,
			offset,
			order: [['id', 'DESC']]
		});
		logger.info(`${fileName}->${name} Data successfully fetched from database ${JSON.stringify(categories)}`);
		return apiResponse.successResponseWithData(res, 'Category successfully fetched', categories);
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// // Get a single category by ID
exports.getSingleCategory = async (req, res) => {
	const name = 'getSingleCategory';
	try {
		const category = await Category.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!category) {
			throw new Error('Category not found');
		} else {
			logger.info(`${fileName}->${name} Category successfully fetched for ${req.params.id} this ID data=${JSON.stringify(category)}`);
			return apiResponse.successResponseWithData(res, 'Category successfully fetched', category);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data successfully not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// // Update a category by ID
exports.update = async (req, res) => {
	const name = 'update';
	try {
		const category = await Category.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!category) {
			throw new Error('Category not found ');
		} else {
			req.body.updatedBy = req?.user?.id;
			await category.update(req.body);
			logger.info(`${fileName}->${name} Category successfully updated and return object ${JSON.stringify(category)}`);
			return apiResponse.successResponseWithData(res, 'Category successfully updated', category);
		}
	} catch (err) {
		if (err?.errors?.length > 0 && err?.errors[0]?.message) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Category successfully not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a category by ID
exports.delete = async (req, res) => {
	const name = 'delete';
	try {
		const category = await Category.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!category) {
			throw new Error('Category not found ');
		} else {
			await category.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} Category successfully deleted and return object ${JSON.stringify(category)}`);
			return apiResponse.successResponseWithData(res, 'Category successfully deleted', category);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Category successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.hardDelete = async (req, res) => {
	const name = 'delete';
	try {
		const category = await Category.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!category) {
			throw new Error('Category not found ');
		} else {
			await category.destroy();
			logger.info(`${fileName}->${name} Category successfully deleted and return object ${JSON.stringify(category)}`);
			return apiResponse.successResponseWithData(res, 'Category successfully deleted', category);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Category successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

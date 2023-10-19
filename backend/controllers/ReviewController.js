const { Review } = require('../models');
const apiResponse = require('../helpers/apiResponse');
const { createReviewSchema, updateReviewSchema } = require('../validators/review');
const logger = require('../helpers/logger');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new review
exports.create = async (req, res) => {
	const name = 'createReview';
	try {
		logger.info(`${fileName}->${name} create function received data from client ${JSON.stringify(req.body)}`);
		const { value, error } = createReviewSchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const review = await Review.create(value);
		logger.info(`${fileName}->${name} Review successfully created and returned object ${JSON.stringify(review)}`);
		return apiResponse.successResponseWithData(res, 'Review successfully created', review);
	} catch (err) {
		logger.error(`${fileName}->${name} Review not created and returned error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
	const name = 'getAllReviews';
	try {
		logger.info(`${fileName}->${name} Parameters received from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req.query.limit) || 10;
		const offset = parseInt(req.query.page) * limit || 0;

		logger.info(`${fileName}->${name} Limit = ${limit}, Offset = ${offset} for fetching data from the database`);

		const reviews = await Review.findAndCountAll({
			where: {
				isDeleted: false
			},
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(reviews)}`);
		return apiResponse.successResponseWithData(res, 'Reviews successfully fetched', reviews);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and returned error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single review by ID
exports.getSingleReview = async (req, res) => {
	const name = 'getSingleReview';
	try {
		const review = await Review.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!review) {
			throw new Error('Review not found');
		} else {
			logger.info(`${fileName}->${name} Review successfully fetched for ID ${req.params.id}, data=${JSON.stringify(review)}`);
			return apiResponse.successResponseWithData(res, 'Review successfully fetched', review);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and returned error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Update a review by ID
exports.update = async (req, res) => {
	const name = 'updateReview';
	try {
		const review = await Review.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!review) {
			throw new Error('Review not found');
		} else {
			const { value, error } = updateReviewSchema.validate(req.body);
			if (error) {
				throw new Error(error.message);
			}
			await review.update(value);
			logger.info(`${fileName}->${name} Review successfully updated and returned object ${JSON.stringify(review)}`);
			return apiResponse.successResponseWithData(res, 'Review successfully updated', review);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Review not updated and returned error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a review by ID
exports.delete = async (req, res) => {
	const name = 'deleteReview';
	try {
		const review = await Review.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!review) {
			throw new Error('Review not found');
		} else {
			await review.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} Review successfully deleted and returned object ${JSON.stringify(review)}`);
			return apiResponse.successResponseWithData(res, 'Review successfully deleted', review);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Review not deleted and returned error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

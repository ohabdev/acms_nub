const { Quote } = require('../models'); 
const apiResponse = require('../helpers/apiResponse');
const path = require('path');
const { createQuoteSchem } = require('../validators/quote');
const fileName = path.basename(__filename);
const logger = require('../helpers/logger');
const { Op } = require('sequelize');

// Create a new Quote
exports.create = async (req, res) => {
	const name = 'createQuote';
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		const { error } = createQuoteSchem.validate(req.body);
		if (error) {
			throw new Error(error);
		}
		const quote = await Quote.create(req.body);
		logger.info(`${fileName}->${name} Quote successfully created and return object ${JSON.stringify(Quote)}`);
		return apiResponse.successResponseWithData(res, 'Quote successfully created', quote);
	} catch (err) {
		console.log(err)
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Quote successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};
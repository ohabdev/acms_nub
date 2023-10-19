const { createTransactionSchema, updateTransactionSchema } = require('../validators/transaction');
const apiResponse = require('../helpers/apiResponse');
const { Transaction, Invoice, Order, Provider, Client, sequelize } = require('../models');
const logger = require('../helpers/logger');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new transaction
exports.create = async (req, res) => {
	const name = 'create';
	const transaction = await sequelize.transaction();
	try {
		logger.info(`${fileName}->${name} Create function get data from client ${JSON.stringify(req.body)}`);
		const { value, error } = createTransactionSchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const transactionRecord = await Transaction.create(value, { transaction });
		await transaction.commit();

		logger.info(`${fileName}->${name} Transaction successfully created and return object ${JSON.stringify(transactionRecord)}`);
		return apiResponse.successResponseWithData(res, 'Transaction successfully created', transactionRecord);
	} catch (err) {
		await transaction.rollback();
		logger.error(`${fileName}->${name} Transaction not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update a transaction by ID
exports.update = async (req, res) => {
	const name = 'update';
	const transaction = await sequelize.transaction();
	try {
		const transactionRecord = await Transaction.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!transactionRecord) {
			throw new Error('Transaction not found');
		} else {
			const { value, error } = updateTransactionSchema.validate(req.body);
			if (error) {
				throw new Error(error.message);
			}
			await transactionRecord.update(value, { transaction });
			await transaction.commit();

			logger.info(`${fileName}->${name} Transaction successfully updated and return object ${JSON.stringify(transactionRecord)}`);
			return apiResponse.successResponseWithData(res, 'Transaction successfully updated', transactionRecord);
		}
	} catch (err) {
		await transaction.rollback();
		logger.error(`${fileName}->${name} Transaction not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
	const name = 'getAllTransactions';
	try {
		logger.info(`${fileName}->${name} Parameters received from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req.query.limit) || 10;
		const offset = parseInt(req.query.page) * limit || 0;

		logger.info(`${fileName}->${name} Limit = ${limit}, Offset = ${offset} for fetching data from the database`);

		const transactions = await Transaction.findAndCountAll({
			where: {
				isDeleted: false
			},
			include: [
				{
					model: Invoice,
					as: 'invoice'
				},
				{
					model: Order,
					as: 'order'
				},
				{
					model: Provider,
					as: 'provider'
				},
				{
					model: Client,
					as: 'client'
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(transactions)}`);
		return apiResponse.successResponseWithData(res, 'Transactions successfully fetched', transactions);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single transaction by ID
exports.getSingleTransaction = async (req, res) => {
	const name = 'getSingleTransaction';
	try {
		const transactionRecord = await Transaction.findOne({
			where: {
				id: req.params.id
			},
			include: [
				{
					model: Invoice,
					as: 'invoice'
				},
				{
					model: Order,
					as: 'order'
				},
				{
					model: Provider,
					as: 'provider'
				},
				{
					model: Client,
					as: 'client'
				}
			]
		});
		if (!transactionRecord) {
			throw new Error('Transaction not found');
		} else {
			logger.info(`${fileName}->${name} Transaction successfully fetched for ID ${req.params.id} data=${JSON.stringify(transactionRecord)}`);
			return apiResponse.successResponseWithData(res, 'Transaction successfully fetched', transactionRecord);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Delete a transaction by ID
exports.delete = async (req, res) => {
	const name = 'delete';
	try {
		const transactionRecord = await Transaction.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!transactionRecord) {
			throw new Error('Transaction not found');
		} else {
			await transactionRecord.update({
				isDeleted: true
			});

			logger.info(`${fileName}->${name} Transaction successfully deleted`);
			return apiResponse.successResponse(res, 'Transaction successfully deleted');
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Transaction not deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

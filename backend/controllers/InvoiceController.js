const { createInvoiceSchema, updateInvoiceSchema } = require('../validators/invoice');
const apiResponse = require('../helpers/apiResponse');
const { Invoice, Order, Provider, Client, sequelize } = require('../models');
const logger = require('../helpers/logger');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new invoice
exports.create = async (req, res) => {
	const name = 'create';
	const transaction = await sequelize.transaction();
	try {
		logger.info(`${fileName}->${name} create function get data from client ${JSON.stringify(req.body)}`);
		const { value, error } = createInvoiceSchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const invoice = await Invoice.create(value, { transaction });
		await transaction.commit();

		logger.info(`${fileName}->${name} Invoice successfully created and return object ${JSON.stringify(invoice)}`);
		return apiResponse.successResponseWithData(res, 'Invoice successfully created', invoice);
	} catch (err) {
		await transaction.rollback();
		logger.error(`${fileName}->${name} Invoice not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update an invoice by ID
exports.update = async (req, res) => {
	const name = 'update';
	const transaction = await sequelize.transaction();
	try {
		const invoice = await Invoice.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!invoice) {
			throw new Error('Invoice not found');
		} else {
			const { value, error } = updateInvoiceSchema.validate(req.body);
			if (error) {
				throw new Error(error.message);
			}
			await invoice.update(value, { transaction });
			await transaction.commit();

			logger.info(`${fileName}->${name} Invoice successfully updated and return object ${JSON.stringify(invoice)}`);
			return apiResponse.successResponseWithData(res, 'Invoice successfully updated', invoice);
		}
	} catch (err) {
		await transaction.rollback();
		logger.error(`${fileName}->${name} Invoice not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
	const name = 'getAllInvoices';
	try {
		logger.info(`${fileName}->${name} Parameters received from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req.query.limit) || 10;
		const offset = parseInt(req.query.page) * limit || 0;

		logger.info(`${fileName}->${name} Limit = ${limit}, Offset = ${offset} for fetching data from the database`);

		const invoices = await Invoice.findAndCountAll({
			where: {
				isDeleted: false
			},
			include: [
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

		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(invoices)}`);
		return apiResponse.successResponseWithData(res, 'Invoices successfully fetched', invoices);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single invoice by ID
exports.getSingleInvoice = async (req, res) => {
	const name = 'getSingleInvoice';
	try {
		const invoice = await Invoice.findOne({
			where: {
				id: req.params.id
			},
			include: [
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
		if (!invoice) {
			throw new Error('Invoice not found');
		} else {
			logger.info(`${fileName}->${name} Invoice successfully fetched for ID ${req.params.id} data=${JSON.stringify(invoice)}`);
			return apiResponse.successResponseWithData(res, 'Invoice successfully fetched', invoice);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Delete an invoice by ID
exports.delete = async (req, res) => {
	const name = 'delete';
	try {
		const invoice = await Invoice.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!invoice) {
			throw new Error('Invoice not found');
		} else {
			await invoice.update({
				isDeleted: true
			});

			logger.info(`${fileName}->${name} Invoice successfully deleted`);
			return apiResponse.successResponse(res, 'Invoice successfully deleted');
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Invoice not deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

const { sendNotificationToProvider, sendNotificationToClient, sendNotificationToSystemUsers } = require('../ws/notifications');
const { Order, sequelize, Client, Provider, User, Service, City, CityRate, ProviderType, ServiceType } = require('../models');
const { createOrderSchema, updateOrderSchema } = require('../validators/order');
const apiResponse = require('../helpers/apiResponse');
const logger = require('../helpers/logger');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new order with associated order items
exports.create = async (req, res) => {
	const name = 'create';
	const transaction = await sequelize.transaction();
	try {
		logger.info(`${fileName}->${name} Create function get data from client ${JSON.stringify(req.body)}`);
		const { value, error } = createOrderSchema.validate(req.body);
		if (error) {
			throw new Error(error.message);
		}
		const userId = req?.user?.id;
		const client = await Client.findOne({
			where: { userId: userId },
			include: [
				{
					model: User,
					as: 'user'
				}
			]
		});
		if (!client) {
			throw new Error('Client not found');
		}

		value.clientId = client.id;
		const service = await Service.findByPk(value.serviceId, {
			include: [
				{
					model: City,
					as: 'city',
					include: [
						{
							model: CityRate,
							as: 'cityRate'
						}
					]
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						},
						{
							model: ProviderType,
							as: 'providerType',
							include: [
								{
									model: ServiceType,
									as: 'serviceType'
								}
							]
						}
					]
				}
			]
		});

		if (!service) {
			throw new Error('Service not found');
		}

		let cityRate = 0.0;
		if (service.provider.providerType.serviceType.slug == 'attorney') {
			cityRate = service.city.cityRate.attorneyRate;
		} else if (service.provider.providerType.serviceType.slug == 'paralegal') {
			cityRate = service.city.cityRate.paralegalRate;
		} else if (service.provider.providerType.serviceType.slug == 'processServer') {
			cityRate = service.city.cityRate.processServerRate;
		}

		value.providerId = service.providerId;
		value.totalPrice = cityRate;

		const order = await Order.create(value, { transaction });
		await transaction.commit();

		req.body.providerId = service.providerId;
		req.body.orderId = order.id;
		req.body.clientId = client.id;

		sendNotificationToProvider(req, 'New order created');
		sendNotificationToClient(req, 'Your order has been placed');
		sendNotificationToSystemUsers(req, 'A new order has been created');

		const orderInfo = await Order.findOne({
			where: {
				isDeleted: false,
				id: order.id
			},
			include: [
				{
					model: Service,
					as: 'service'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				},
				{
					model: Client,
					as: 'client',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				}
			]
		});

		logger.info(`${fileName}->${name} Order successfully created and return object ${JSON.stringify(orderInfo)}`);
		return apiResponse.successResponseWithData(res, 'Order and associated order successfully created', orderInfo);
	} catch (err) {
		await transaction.rollback();
		logger.error(`${fileName}->${name} Order not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update an order and associated order items by ID
exports.update = async (req, res) => {
	const name = 'update';
	const transaction = await sequelize.transaction();

	try {
		const order = await Order.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!order) {
			throw new Error('Order not found');
		} else {
			const { value, error } = updateOrderSchema.validate(req.body);
			if (error) {
				throw new Error(error.message);
			}

			await order.update(value, { transaction });

			await transaction.commit();

			const orderInfo = await Order.findOne({
				where: {
					isDeleted: false,
					id: order.id
				},
				include: [
					{
						model: Service,
						as: 'service'
					},
					{
						model: Provider,
						as: 'provider',
						include: [
							{
								model: User,
								as: 'user'
							}
						]
					},
					{
						model: Client,
						as: 'client',
						include: [
							{
								model: User,
								as: 'user'
							}
						]
					}
				]
			});

			logger.info(`${fileName}->${name} Order successfully updated and return object ${JSON.stringify(orderInfo)}`);
			return apiResponse.successResponseWithData(res, 'Order successfully updated', orderInfo);
		}
	} catch (err) {
		await transaction.rollback();
		logger.error(`${fileName}->${name} Order not updated and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all orders
exports.getAllOrders = async (req, res) => {
	const name = 'getAllOrders';
	try {
		logger.info(`${fileName}->${name} Parameters received from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req.query.limit) || 10;
		const offset = parseInt(req.query.page) * limit || 0;

		logger.info(`${fileName}->${name} Limit = ${limit}, Offset = ${offset} for fetching data from the database`);
		const orders = await Order.findAndCountAll({
			where: {
				isDeleted: false
			},
			include: [
				{
					model: Service,
					as: 'service'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				},
				{
					model: Client,
					as: 'client',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(orders)}`);
		return apiResponse.successResponseWithData(res, 'Orders successfully fetched', orders);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get all provider orders
exports.providerOrders = async (req, res) => {
	const name = 'providerOrders';
	try {
		logger.info(`${fileName}->${name} Parameters received from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req.query.limit) || 10;
		const offset = parseInt(req.query.page) * limit || 0;

		logger.info(`${fileName}->${name} Limit = ${limit}, Offset = ${offset} for fetching data from the database`);

		const userId = req?.user?.id;
		const provider = await Provider.findOne({ where: { userId: userId } });
		if (!provider) {
			throw new Error('Provider not found');
		}
		const providerOrders = await Order.findAndCountAll({
			where: {
				isDeleted: false
			},
			include: [
				{
					model: Service,
					as: 'service'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				},
				{
					model: Client,
					as: 'client',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(providerOrders)}`);
		return apiResponse.successResponseWithData(res, 'Provider orders', providerOrders);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get all client orders
exports.clientOrders = async (req, res) => {
	const name = 'clientOrders';
	try {
		logger.info(`${fileName}->${name} Parameters received from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req.query.limit) || 10;
		const offset = parseInt(req.query.page) * limit || 0;

		logger.info(`${fileName}->${name} Limit = ${limit}, Offset = ${offset} for fetching data from the database`);

		const userId = req?.user?.id;
		const client = await Client.findOne({ where: { userId: userId } });
		if (!client) {
			throw new Error('Client not found');
		}

		const clientOrders = await Order.findAndCountAll({
			where: {
				isDeleted: false,
				clientId: client.id
			},
			include: [
				{
					model: Service,
					as: 'service'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				},
				{
					model: Client,
					as: 'client',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				}
			],
			limit,
			offset,
			order: [['id', 'DESC']]
		});

		logger.info(`${fileName}->${name} Data successfully fetched from the database ${JSON.stringify(clientOrders)}`);
		return apiResponse.successResponseWithData(res, 'client orders', clientOrders);
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Get a single order by ID
exports.getSingleOrder = async (req, res) => {
	const name = 'getSingleOrder';
	try {
		const order = await Order.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			},
			include: [
				{
					model: Service,
					as: 'service'
				},
				{
					model: Provider,
					as: 'provider',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				},
				{
					model: Client,
					as: 'client',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				}
			]
		});
		if (!order) {
			throw new Error('Order not found');
		} else {
			logger.info(`${fileName}->${name} Order successfully fetched for ID ${req.params.id} data=${JSON.stringify(order)}`);
			return apiResponse.successResponseWithData(res, 'Order successfully fetched', order);
		}
	} catch (error) {
		logger.error(`${fileName}->${name} Data not fetched and return error ${JSON.stringify(error)}`);
		return apiResponse.ErrorResponse(res, error.message);
	}
};

// Delete an order by ID
exports.delete = async (req, res) => {
	const name = 'delete';
	try {
		const order = await Order.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!order) {
			throw new Error('Order not found');
		} else {
			await order.update({
				isDeleted: true
			});

			logger.info(`${fileName}->${name} Order successfully deleted and return object ${JSON.stringify(order)}`);
			return apiResponse.successResponseWithData(res, 'Order successfully deleted', order);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Order not deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

exports.hardDelete = async (req, res) => {
	const name = 'delete';
	try {
		const order = await Order.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!order) {
			throw new Error('Order not found ');
		} else {
			await order.destroy();
			logger.info(`${fileName}->${name} Order successfully deleted and return object ${JSON.stringify(order)}`);
			return apiResponse.successResponseWithData(res, 'Order successfully deleted', order);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Order successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

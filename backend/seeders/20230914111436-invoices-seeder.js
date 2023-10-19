const { Invoice, Order } = require('../models');

module.exports = {
	up: async () => {
		const orders = await Order.findAll({});
		for (const order of orders) {
			await Invoice.create({
				orderId: order.id,
				clientId: order.clientId,
				providerId: order.providerId,
				serviceId: order.serviceId,
				amount: order.totalPrice,
				currency: 'USD',
				status: 'unpaid'
			});
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('invoices', null, {});
	}
};

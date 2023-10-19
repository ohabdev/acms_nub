const { Review, Order, Provider, Client } = require('../models');
const { faker } = require('@faker-js/faker');

module.exports = {
	up: async () => {
		const provider = await Provider.findOne();
		const client = await Client.findOne();
		const orders = await Order.findAll({});

		for (const order of orders) {
			await Review.create({
				clientId: client.id,
				serviceId: order.serviceId,
				providerId: provider.id,
				orderId: order.id,
				userType: 'client',
				rating: faker.commerce.price({ min: 1, max: 5 }),
				review: faker.lorem.sentences({ min: 1, max: 7 })
			});
		}

		for (const order of orders) {
			await Review.create({
				clientId: client.id,
				serviceId: order.serviceId,
				providerId: provider.id,
				orderId: order.id,
				userType: 'provider',
				rating: faker.commerce.price({ min: 1, max: 5 }),
				review: faker.lorem.sentences({ min: 1, max: 7 })
			});
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('reviews', null, {});
	}
};

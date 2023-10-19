const { Client, Provider, Service, Order, CityRate, City } = require('../models');
const { faker } = require('@faker-js/faker');

module.exports = {
	up: async () => {
		const provider = await Provider.findOne();
		const client = await Client.findOne();
		const services = await Service.findAll({
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
				}
			]
		});

		for (const service of services) {
			await Order.create({
				clientId: client.id,
				providerId: provider.id,
				serviceId: service.id,
				hearingDate: new Date(),
				caseDescription: faker.lorem.lines(5),
				isCourtLocationKnown: 'YES',
				isCourtLocationRemote: 'NO',
				courtLocation: `${faker.location.streetAddress(true)}, ${faker.location.city()}`,
				opposingPartyName: `${firstName} ${lastName}`,
				totalPrice: service.city.cityRate.attorneyRate
			});
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('orders', null, {});
	}
};

const { ServiceType, ProviderType, Provider, Service, City, Category } = require('../models');
const { faker } = require('@faker-js/faker');
const appName = process.env.APP_NAME;
module.exports = {
	up: async () => {
		const provider = await Provider.findOne({
			include: [
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
		});
		const city = await City.findOne();

		const cat = await Category.findOne({
			where: {
				name: appName
			}
		});

		const serviceTypes = await ServiceType.findAll({ categoryId: cat.id });
		const formattedServiceTypes = [];

		const itemMap = new Map();

		serviceTypes.forEach((item) => {
			const parentId = item.parentId || item.id;
			if (!itemMap.has(parentId)) {
				itemMap.set(parentId, []);
			}
			itemMap.get(parentId).push(item);
		});

		itemMap.forEach((subServices, parentId) => {
			const parentService = serviceTypes.find((item) => item.id === parentId);
			if (parentService) {
				parentService.subServices = subServices;
				formattedServiceTypes.push(parentService);
			}
		});

		for (const serviceType of formattedServiceTypes) {
			if (serviceType.subServices) {
				for (const subService of serviceType.subServices) {
					await Service.create({
						serviceName: subService.name,
						categoryId: subService.categoryId,
						serviceTypeId: provider.providerType.serviceType.id,
						subServiceTypeId: subService.id,
						countryId: city.countryId,
						countyId: city.countyId,
						stateId: city.stateId,
						cityId: city.id,
						street: faker.location.streetAddress(true),
						latitude: city.latitude,
						longitude: city.longitude,
						providerId: provider.id
					});
				}
			}
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('services', null, {});
	}
};

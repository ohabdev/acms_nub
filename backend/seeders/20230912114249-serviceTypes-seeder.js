const serviceTypes = require('../public/data/ServiceTypes.json');
const { Category, ServiceType } = require('../models');
const { generateSlug } = require('../helpers/utility');
const { faker } = require('@faker-js/faker');

const appName = process.env.APP_NAME;

module.exports = {
	up: async () => {
		const catName = await Category.findOne({
			where: {
				name: appName
			}
		});

		for (const s of serviceTypes) {
			const serviceType = await ServiceType.create({
				categoryId: catName.id,
				price: faker.commerce.price({ min: 100, max: 1000 }),
				name: s.name,
				slug: generateSlug(s.name)
			});
			if (s.subtypes) {
				for (const subServiceType of s.subtypes) {
					await ServiceType.create({
						parentId: serviceType.id,
						categoryId: catName.id,
						price: faker.commerce.price({ min: 100, max: 1000 }),
						name: subServiceType.name,
						slug: generateSlug(subServiceType.name)
					});
				}
			}
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('serviceTypes', null, {});
	}
};

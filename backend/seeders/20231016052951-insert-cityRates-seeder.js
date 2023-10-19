const { City, CityRate } = require('../models');

module.exports = {
	up: async () => {
		const cities = await City.findAll();
		for (const city of cities) {
			await CityRate.create({
				cityId: city.id,
				attorneyRate: 0.0,
				paralegalRate: 0.0,
				processServerRate: 0.0
			});
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('cityRates', null, {});
	}
};

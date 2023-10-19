const { Country, State, County, City } = require('../models');
const { countries } = require('../public/data/bd.json');

module.exports = {
	up: async () => {
		for (const countryData of countries) {
			const countryInfo = await Country.create({
				name: countryData.name,
				code: countryData.code
			});
			for (const stateData of countryData.divisions) {
				const stateInfo = await State.create({
					countryId: countryInfo.id,
					code: stateData.bn_name,
					name: stateData.name
				});
				for (const countyData of stateData.districts) {
					const countyInfo = await County.create({
						name: countyData.name,
						countryId: countryInfo.id,
						stateId: stateInfo.id
					});
					for (const cityData of countyData.upazilas) {
						await City.create({
							name: cityData.name,
							latitude: cityData.lat,
							longitude: cityData.lng,
							timezone: cityData.bn_name,
							countryId: countryInfo.id,
							stateId: stateInfo.id,
							countyId: countyInfo.id
						});
					}
				}
			}
		}
	},
	down: async (queryInterface) => {
		await queryInterface.bulkDelete('cities', null, {});
		await queryInterface.bulkDelete('counties', null, {});
		await queryInterface.bulkDelete('states', null, {});
		await queryInterface.bulkDelete('countries', null, {});
	}
};

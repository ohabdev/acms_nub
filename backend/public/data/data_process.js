const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');

const inputData = path.join(__dirname, 'us_locations.csv');
const outputData = 'public/data/countries.json';
const logger = require('../../helpers/logger');
const data = [];

const country = {
	name: 'United States',
	code: 'US',
	states: []
};

fs.createReadStream(inputData)
	.pipe(csv())
	.on('data', (row) => {
		const { state_id, state_name, county_name, lat, lng, city, timezone } = row;

		let stateIndex = data.findIndex((state) => state.state_id === state_id);
		if (stateIndex === -1) {
			stateIndex =
				data.push({
					state_id,
					state_name,
					counties: []
				}) - 1;
		}

		let countyIndex = data[stateIndex].counties.findIndex((county) => county.county_name === county_name);
		if (countyIndex === -1) {
			countyIndex =
				data[stateIndex].counties.push({
					county_name,
					cities: []
				}) - 1;
		}

		data[stateIndex].counties[countyIndex].cities.push({
			name: city,
			lat: lat,
			lng: lng,
			timezone: timezone
		});
	})
	.on('end', () => {
		country.states = data.map((state) => ({
			state_id: state.state_id,
			state_name: state.state_name,
			counties: state.counties
		}));

		const formattedData = {
			countries: [country]
		};
		fs.writeFile(outputData, JSON.stringify(formattedData, null, 2), (err) => {
			if (err) {
				logger.error('Error writing JSON file:', err);
			} else {
				logger.info('JSON file successfully formatted and saved!');
			}
		});
	});

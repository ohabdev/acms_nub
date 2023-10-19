const fs = require('fs');

// Load the JSON data from the downloaded files
const { divisions } = require('./bd-divisions.json');
const { districts } = require('./bd-districts.json');
const { upazilas } = require('./bd-upazilas.json');
const { postcodes } = require('./bd-postcodes.json');

// Create an empty countries array to store the divisions
const countries = [];

// Process postcodes and add them to upazilas
upazilas.forEach((upazila) => {
	upazila.postcodes = postcodes.filter((postcode) => postcode.district_id === upazila.district_id && postcode.upazila === upazila.name);
});

// Process upazilas and add them to districts
districts.forEach((district) => {
	district.upazilas = upazilas.filter((upazila) => upazila.district_id === district.id);
});

// Process districts and add them to divisions
divisions.forEach((division) => {
	division.districts = districts.filter((district) => district.division_id === division.id);
});

// Add the divisions to the countries array
countries.push(...divisions);

// Define the output JSON file path
const outputData = 'public/data/bd.json';

// Create a JSON object with the structured data
const formattedData = {
	countries
};

// Save the structured data to a JSON file
fs.writeFileSync(outputData, JSON.stringify(formattedData, null, 2), (err) => {
	if (err) {
		console.error('Error writing JSON file:', err);
	} else {
		console.log('JSON file successfully formatted and saved!');
	}
});

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.cityRate = async (app, token) => {
	describe('CityRate Routes', async () => {
		let cityRateById;
		it('should get all City Rate', async () => {
			const res = await request(app)
				.get('/city-rate')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a city rate', async () => {
			const res = await request(app)
				.post('/city-rate/create')
				.set('Authorization', 'Bearer ' + token)
				.send({
					cityId: 1, // Replace with an actual city ID
					attorneyRate: 100.0,
					paralegalRate: 50.0,
					processServerRate: 75.0
				})
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				cityRateById = res?.body?.data?.id;
			}
		});

		it('should get a single city rate by ID', async () => {
			const res = await request(app)
				.get('/city-rate/' + cityRateById)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a city rate by ID', async () => {
			const res = await request(app)
				.put('/city-rate/' + cityRateById)
				.set('Authorization', 'Bearer ' + token)
				.send({
					cityId: 1,
					attorneyRate: 150.0,
					paralegalRate: 75.0,
					processServerRate: 100.0
				})
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should delete a city rate by ID', async () => {
			const res = await request(app)
				.delete('/city-rate/' + cityRateById)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should hard delete a city rate by ID', async () => {
			const res = await request(app)
				.delete('/city-rate/hard-delete/' + cityRateById)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

// exports.cityRateById = async (app, token, cityRateById) => {
// 	it('should get a single city rate by ID', async () => {
// 		const res = await request(app)
// 			.get('/city-rate/' + cityRateById)
// 			.set('Authorization', 'Bearer ' + token)
// 			.expect(200);

// 		expect(res.body).to.be.an('object');
// 	});

// 	it('should update a city rate by ID', async () => {
// 		const res = await request(app)
// 			.put('/city-rate/' + cityRateById)
// 			.set('Authorization', 'Bearer ' + token)
// 			.send({
// 				cityId: 1,
// 				attorneyRate: 150.0,
// 				paralegalRate: 75.0,
// 				processServerRate: 100.0
// 			})
// 			.expect(200);

// 		expect(res.body).to.be.an('object');
// 	});

// 	it('should delete a city rate by ID', async () => {
// 		const res = await request(app)
// 			.delete('/city-rate/' + cityRateById)
// 			.set('Authorization', 'Bearer ' + token)
// 			.expect(200);

// 		expect(res.body).to.be.an('object');
// 	});

// 	it('should hard delete a city rate by ID', async () => {
// 		const res = await request(app)
// 			.delete('/city-rate/hard-delete/' + cityRateById)
// 			.set('Authorization', 'Bearer ' + token)
// 			.expect(200);

// 		expect(res.body).to.be.an('object');
// 	});
// };

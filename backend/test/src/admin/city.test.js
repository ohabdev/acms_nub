const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
exports.city = async (app, token) => {
	describe('City Routes', () => {
		it('should get all cities', async () => {
			const res = await request(app)
				.get('/city')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a single city', async () => {
			const res = await request(app)
				.post('/city/create')
				.send({
					name: 'Test City',
					countryId: 1,
					stateId: 1
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				await exports.cityById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.cityById = async (app, token, cityId) => {
	describe('City By Id', () => {
		it('should get a single city by ID', async () => {
			const res = await request(app)
				.get('/city/' + cityId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a single city', async () => {
			const res = await request(app)
				.put('/city/' + cityId)
				.send({
					name: 'Test City Updated',
					countryId: 1,
					stateId: 1
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
			expect(res.body).to.be.an('object');
		});

		it('should delete a single city', async () => {
			const res = await request(app)
				.delete('/city/' + cityId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should hard delete a single city', async () => {
			const res = await request(app)
				.delete('/city/hard-delete/' + cityId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

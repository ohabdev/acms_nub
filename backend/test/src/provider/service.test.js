const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.service = async (app, token) => {
	describe('Service Routes', () => {
		let createdServiceId;

		it('should get all services', async () => {
			const res = await request(app).get('/service').expect(200);
			expect(res.body).to.be.an('object');
		});

		it('should create a single service', async () => {
			const res = await request(app)
				.post('/service/create')
				.set('Authorization', 'Bearer ' + token)
				.send({
					serviceName: 'Test service test',
					availability: 'remote-only',
					serviceTypeId: 1,
					subServiceTypeId: 12,
					countryId: 1,
					stateId: 1,
					countyId: 1,
					cityId: 1,
					price: 320
				})
				.expect(200);
			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				createdServiceId = res.body.data.id;
			}
		});

		it('should get a single service by ID', async () => {
			if (!createdServiceId) {
				this.skip();
			}

			const res = await request(app)
				.get('/service/' + createdServiceId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a single service', async () => {
			if (!createdServiceId) {
				this.skip();
			}

			const res = await request(app)
				.put('/service/' + createdServiceId)
				.set('Authorization', 'Bearer ' + token)
				.send({
					serviceName: 'Test service for attorny new 1',
					availability: 'remote-only',
					serviceTypeId: 1,
					subServiceTypeId: 12,
					countryId: 1,
					stateId: 1,
					countyId: 1,
					cityId: 1,
					price: 320
				})
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should delete a single service', async () => {
			if (!createdServiceId) {
				this.skip();
			}

			const res = await request(app)
				.delete('/service/' + createdServiceId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should search services', async () => {
			const query = 'attorney';
			const res = await request(app).get('/service/search').query({ q: query }).expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should get single service by ID', async () => {
			const serviceId = 1;
			const res = await request(app)
				.get('/service/' + serviceId)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.serviceType = async (app, token) => {
	describe('ServiceType Routes', () => {
		it('should get all service types', async () => {
			const res = await request(app)
				.get('/serviceType/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a single service type', async () => {
			const res = await request(app)
				.post('/serviceType/create')
				.send({
					name: 'Attorney Create Test',
					categoryId: 1,
					price: 999.0
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				await exports.serviceTypesById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.serviceTypesById = async (app, token, serviceTypeId) => {
	describe('serviceType by id Routes', () => {
		it('should get a single service type by ID', async () => {
			const res = await request(app)
				.get('/serviceType/' + serviceTypeId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a single service type', async () => {
			const res = await request(app)
				.put('/serviceType/' + serviceTypeId)
				.send({
					name: 'Attorney update Test',
					categoryId: 1,
					price: 999.0
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should delete a single service type', async () => {
			const res = await request(app)
				.delete('/serviceType/' + serviceTypeId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
		it('should hard delete a single service type', async () => {
			const res = await request(app)
				.delete('/serviceType/hard-delete/' + serviceTypeId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

exports.subServiceTypes = async (app, token) => {
	describe('SubServiceType Routes', () => {
		it('should get all sub-service types', async () => {
			const res = await request(app)
				.get('/serviceType/sub-serviceTypes')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
		it('should get all sub-service types by ID', async () => {
			const res = await request(app)
				.get('/serviceType/sub-serviceTypes/' + 1)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
		it('should create a single sub service type', async () => {
			const res = await request(app)
				.post('/serviceType/create')
				.send({
					name: 'Criminal law create',
					categoryId: 1,
					parentId: 1,
					price: 300
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				await exports.subServiceTypesById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.subServiceTypesById = async (app, token, id) => {
	describe('subServiceTypesById Routes', () => {
		it('should get a single sub service type by ID', async () => {
			const res = await request(app)
				.get('/serviceType/' + id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
		it('should delete a single sub service type', async () => {
			const res = await request(app)
				.delete('/serviceType/' + id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
		it('should hard delete a single sub service type', async () => {
			const res = await request(app)
				.delete('/serviceType/hard-delete/' + id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

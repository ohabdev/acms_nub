const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.county = async (app, token) => {
	describe('County Routes', () => {
		it('should get all counties', async () => {
			const res = await request(app)
				.get('/county')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a single county', async () => {
			const res = await request(app)
				.post('/county/create')
				.send({
					name: 'Test county',
					countryId: 1,
					stateId: 1
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				await exports.countyById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.countyById = async (app, token, countyId) => {
	describe('County By Id', () => {
		it('should get a single county by ID', async () => {
			const res = await request(app)
				.get('/county/' + countyId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a single county', async () => {
			const res = await request(app)
				.put('/county/' + countyId)
				.send({
					name: 'Test County Updated',
					countryId: 1,
					stateId: 1
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should delete a single county', async () => {
			const res = await request(app)
				.delete('/county/' + countyId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should hard delete a single county', async () => {
			const res = await request(app)
				.delete('/county/hard-delete/' + countyId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

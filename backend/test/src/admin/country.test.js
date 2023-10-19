const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.country = async (app, token) => {
	describe('Country Routes', () => {
		it('should get all country', async () => {
			const res = await request(app)
				.get('/country')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a single country', async () => {
			const res = await request(app)
				.post('/country/create')
				.send({
					name: 'Test Country',
					code: 'USA'
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');

			if (res?.body?.data?.id) {
				await exports.countryById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.countryById = async (app, token, id) => {
	describe('Country By Id', () => {
		it('should get a single country', async () => {
			const res = await request(app)
				.get('/country/' + id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
		it('should update a single country', async () => {
			const res = await request(app)
				.put('/country/' + id)
				.send({
					name: 'Test Country updated'
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
		it('should delete a single country', async () => {
			const res = await request(app)
				.delete('/country/' + id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
			expect(res.body).to.be.an('object');
		});
		it('should hard delete a single country', async () => {
			const res = await request(app)
				.delete('/country/hard-delete/' + id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

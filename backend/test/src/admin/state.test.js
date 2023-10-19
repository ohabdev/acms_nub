const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
exports.state = async (app, token) => {
	describe('State Routes', () => {
		it('should get all states', async () => {
			const res = await request(app)
				.get('/state')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a single state', async () => {
			const res = await request(app)
				.post('/state/create/')
				.send({
					name: 'test state',
					countryId: 1
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				await exports.stateById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.stateById = async (app, token, stateId) => {
	describe('State By Id', () => {
		it('should get a single state by ID', async () => {
			const res = await request(app)
				.get('/state/' + stateId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a single state', async () => {
			const res = await request(app)
				.put('/state/' + stateId)
				.send({
					name: 'Test State Updated'
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should delete a single state', async () => {
			const res = await request(app)
				.delete('/state/' + stateId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should hard delete a single state', async () => {
			const res = await request(app)
				.delete('/state/hard-delete/' + stateId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

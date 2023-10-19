const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.order = async (app, token) => {
	describe('GET /provider', async () => {
		it('should get provider orders', async () => {
			const res = await request(app)
				.get('/order/provider')
				.set('Authorization', 'Bearer ' + token);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
		});
	});
};

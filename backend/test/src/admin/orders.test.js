const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
exports.orders = async (app, token) => {
	describe('Order Routes', () => {
		it('should get all orders', (done) => {
			request(app)
				.get('/order/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).to.be.an('object');
					done();
				});
		});
		it('should get a single order', (done) => {
			request(app)
				.get('/order/3')
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body).to.be.an('object');
					done();
				});
		});
	});
};

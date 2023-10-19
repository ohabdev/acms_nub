const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.users = async (app, token) => {
	describe('User Routes', () => {
		it('should get the current user profile', (done) => {
			request(app)
				.get('/users/me')
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
					// Add your assertions here
					expect(res.body.success).to.be.true;
					done();
				});
		});
	});
};

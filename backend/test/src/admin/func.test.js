const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.func = async (app, token) => {
	describe('Function Routes', () => {
		it('should get all categories', async () => {
			const res = await request(app)
				.get('/function')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a single Function', async () => {
			const res = await request(app)
				.post('/function/create')
				.send({
					name: 'test function',
					path: '/city/',
					method: 'GET'
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				await exports.funcById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.funcById = async (app, token, funcById) => {
	describe('Function By Id', () => {
		it('should get a single Function by ID', async () => {
			const res = await request(app)
				.get('/function/' + funcById)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a single Function', async () => {
			const res = await request(app)
				.put('/function/' + funcById)
				.send({
					name: 'test function update',
					path: '/city/',
					method: 'GET'
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should delete a single Function', async () => {
			const res = await request(app)
				.delete('/function/' + funcById)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should hard delete a single Function', async () => {
			const res = await request(app)
				.delete('/function/hard-delete/' + funcById)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

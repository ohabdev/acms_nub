const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.category = async (app, token) => {
	describe('Category Routes', () => {
		it('should get all categories', async () => {
			const res = await request(app)
				.get('/category')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a single category', async () => {
			const res = await request(app)
				.post('/category/create')
				.send({
					name: 'Test Category'
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				await exports.categoryById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.categoryById = async (app, token, categoryId) => {
	describe('Category By Id', () => {
		it('should get a single category by ID', async () => {
			const res = await request(app)
				.get('/category/' + categoryId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a single category', async () => {
			const res = await request(app)
				.put('/category/' + categoryId)
				.send({
					name: 'Test Category Updated',
					description: 'Updated category description'
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should delete a single category', async () => {
			const res = await request(app)
				.delete('/category/' + categoryId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should hard delete a single category', async () => {
			const res = await request(app)
				.delete('/category/hard-delete/' + categoryId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

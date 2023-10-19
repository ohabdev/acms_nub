const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.role = async (app, token) => {
	describe('Role Routes', () => {
		it('should get all roles', async () => {
			const res = await request(app)
				.get('/role')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should get system roles', async () => {
			const res = await request(app)
				.get('/role/system-roles')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should create a single role', async () => {
			const res = await request(app)
				.post('/role/create')
				.send({
					roleName: 'Test Role',
					permissions: [
						{
							functionId: 1
						}
					]
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.id) {
				await exports.roleById(app, token, res?.body?.data?.id);
			}
		});
	});
};

exports.roleById = async (app, token, roleId) => {
	describe('Role By Id', () => {
		it('should get a single role by ID', async () => {
			const res = await request(app)
				.get('/role/' + roleId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update a single role', async () => {
			const res = await request(app)
				.put('/role/' + roleId)
				.send({
					roleName: 'Test Role update',
					permissions: [
						{
							functionId: 1
						}
					]
				})
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should delete a single role', async () => {
			const res = await request(app)
				.delete('/role/' + roleId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should hard delete a single role', async () => {
			const res = await request(app)
				.delete('/role/hard-delete/' + roleId)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

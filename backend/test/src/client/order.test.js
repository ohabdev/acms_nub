const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.order = async (app, token) => {
	describe('Order Routes', async () => {
		describe('POST /order/create', async () => {
			it('should create a new order', async () => {
				const res = await request(app)
					.post('/order/create')
					.set('Authorization', 'Bearer ' + token)
					.send({
						caseDescription: 'This is a test case description.',
						hearingDate: '2023-08-06',
						isCourtLocationKnown: 'YES',
						isCourtLocationRemote: 'NO',
						courtLocation: '129 down town',
						serviceId: 1
					});

				expect(res.body).to.be.an('object');
				if (res?.body?.data?.id) {
					await exports.orderById(app, token, res?.body?.data?.id);
				}
			});

			// The other tests can also be converted to use async/await in a similar manner
			// For example:

			// describe('GET /', () => {
			//   it('should get all orders', async () => {
			//     const res = await request(app)
			//       .get('/')
			//       .set('Authorization', 'Bearer ' + token);

			//     expect(res.status).to.equal(200);
			//     expect(res.body).to.be.an('array');
			//   });
			// });

			// describe('GET /provider', () => {
			//   it('should get provider orders', async () => {
			//     const res = await request(app)
			//       .get('/provider')
			//       .set('Authorization', 'Bearer ' + token)
			//       .query({ providerId: 1 });

			//     expect(res.status).to.equal(200);
			//     expect(res.body).to.be.an('array');
			//   });
			// });

			describe('GET /order/client', async () => {
				it('should get client orders', async () => {
					const res = await request(app)
						.get('/order/client/')
						.set('Authorization', 'Bearer ' + token)
						.expect(200);
					expect(res.body).to.be.an('object');
				});
			});
		});
	});
};

exports.orderById = async (app, token, createdOrderId) => {
	describe('GET /order/:id', async () => {
		it('should get a single order by ID', async () => {
			const res = await request(app)
				.get(`/order/${createdOrderId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});

	describe('PUT /order/:id', async () => {
		it('should update an order by ID', async () => {
			const res = await request(app)
				.put(`/order/${createdOrderId}`)
				.set('Authorization', 'Bearer ' + token)
				.send({
					caseDescription: 'Updated case description',
					hearingDate: '2023-12-01',
					isCourtLocationKnown: 'YES',
					isCourtLocationRemote: 'NO',
					courtLocation: 'Updated Court Location',
					totalPrice: 999.0
				});

			expect(res.body).to.be.an('object');
		});
	});

	describe('DELETE /order/:id', async () => {
		it('should delete an order by ID', async () => {
			const res = await request(app)
				.delete(`/order/${createdOrderId}`)
				.set('Authorization', 'Bearer ' + token);

			expect(res.status).to.equal(200);
		});
	});

	describe('DELETE /order/hard-delete/:id', async () => {
		it('should hard delete a single order', async () => {
			const res = await request(app)
				.delete('/order/hard-delete/' + createdOrderId)
				.set('Authorization', 'Bearer ' + token);

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('object');
		});
	});
};

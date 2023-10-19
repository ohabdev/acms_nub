const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

exports.user = async (app, token) => {
	describe('Provider user routes test', async () => {
		it('should get current user data', async () => {
			const res = await request(app)
				.get('/users/me')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
			expect(res.body).to.be.an('object');
		});

		it('should send a otp', async () => {
			const res = await request(app)
				.post('/users/send-otp')
				.set('Authorization', 'Bearer ' + token)
				.send({
					phoneNumber: '01755412704'
				})
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.otp) {
				await exports.verifyOtp(app, token, res?.body?.data?.otp);
			}
		});

		it('should send  forgot password mail', async () => {
			const res = await request(app)
				.post('/users/forgot-password')
				.set('Authorization', 'Bearer ' + token)
				.send({
					email: 'ohabdev@gmail.com'
				})
				.expect(200);

			expect(res.body).to.be.an('object');
			if (res?.body?.data?.resetToken) {
				await exports.verifyMail(app, token, res?.body?.data?.resetToken);
			}
		});

		it('should update user type', async () => {
			const res = await request(app)
				.post('/users/user-type')
				.set('Authorization', 'Bearer ' + token)
				.send({
					isClient: false,
					isProvider: true
				})
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update provider type', async () => {
			const res = await request(app)
				.post('/users/provider-type')
				.set('Authorization', 'Bearer ' + token)
				.send({
					serviceTypeIds: [1]
				})
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update provider type', async () => {
			const res = await request(app)
				.get('/users/provider-type')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should changed old password to new password', async () => {
			const res = await request(app)
				.post('/users/change-password')
				.set('Authorization', 'Bearer ' + token)
				.send({
					oldPassword: 'Password@321',
					newPassword: 'Password@3211'
				})
				.expect(200);

			expect(res.body).to.be.an('object');
		});

		it('should update provider profile', async () => {
			const res = await request(app)
				.put('/users/provider')
				.set('Authorization', 'Bearer ' + token)
				.send({
					firstName: 'John',
					lastName: 'Doe',
					dob: '1990-01-15',
					gender: 'male',
					profilePicture: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg',
					phoneNumber: '123-456-7890',
					countryId: 1,
					countyId: 1,
					stateId: 1,
					cityId: 1,
					zipCode: '945488',
					longitude: '2.945488',
					latitude: '2.945488',
					address: 'fbfgrbfb  8',
					serviceLocations: [1],
					practiceAreas: [10, 9],
					stateBarNumber: '12345',
					proofOfMalpracticeInsurance: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg',
					appearanceAvailability: 'both',
					yearsOfPractice: '1-10',
					officeAddress: '123 Main St, Suite 101',
					termsOfAgreement: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg'
				})
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

exports.verifyOtp = async (app, token, otp) => {
	describe('Provider user routes test', async () => {
		it('should verify the otp', async () => {
			const res = await request(app)
				.post('/users/verify-otp')
				.set('Authorization', 'Bearer ' + token)
				.send({
					otp: otp
				})
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

exports.verifyMail = async (app, token, resetToken) => {
	describe('Provider user routes test', async () => {
		it('should verify email', async () => {
			const res = await request(app)
				.post('/users/reset-password')
				.set('Authorization', 'Bearer ' + token)
				.send({
					newPassword: 'Password@321',
					token: resetToken
				})
				.expect(200);

			expect(res.body).to.be.an('object');
		});
	});
};

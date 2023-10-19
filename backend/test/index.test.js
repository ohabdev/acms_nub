const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../server');
const { systemUser } = require('./src/systemUser.test');
const { provider } = require('./src/provider.test');
const { client } = require('./src/client.test');
const { faker } = require('@faker-js/faker');

it('should login a system user', async () => {
	const res = await request(app).post('/auth/login').send({ email: 'superadmin@example.com', password: 'password@321' }).expect(200);
	expect(res.body.message).to.equal('Login Success.');
	if (res?.body?.data?.token) {
		await systemUser(app, res?.body?.data?.token);
	}
});

describe('Provider Flow Test', async () => {
	const providerCred = {
		email: faker.internet.email(),
		password: 'Password@321'
	};

	it('should register provider', async () => {
		const res = await request(app).post('/auth/register').send(providerCred).expect(200);
		expect(res.body.success).to.equal(true);
	});

	it('should login a provider', async () => {
		const res = await request(app).post('/auth/login').send(providerCred).expect(200);
		expect(res.body.message).to.equal('Login Success.');
		if (res?.body?.data?.token) {
			await provider(app, res?.body?.data?.token);
		}
	});
});

describe('Client Flow Test', async () => {
	const clientCred = {
		email: faker.internet.email(),
		password: 'Password@321'
	};

	it('should register Client', async () => {
		const res = await request(app).post('/auth/register').send(clientCred).expect(200);
		expect(res.body.success).to.equal(true);
	});

	it('should login a client', async () => {
		const res = await request(app).post('/auth/login').send(clientCred).expect(200);
		expect(res.body.message).to.equal('Login Success.');
		if (res?.body?.data?.token) {
			await client(app, res?.body?.data?.token);
		}
	});
});

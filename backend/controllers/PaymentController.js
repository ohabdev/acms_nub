const apiResponse = require('../helpers/apiResponse');
const logger = require('../helpers/logger');
const axios = require('axios');

const { ESCROW_API_KEY, ESCROW_API_ENDPOINT, ESCROW_ACCOUNT_MAIL } = process.env;
const authAdminHeader = `Basic ${Buffer.from(`${ESCROW_ACCOUNT_MAIL}:${ESCROW_API_KEY}`).toString('base64')}`;

const escrowAdminConfig = {
	headers: {
		'Content-Type': 'application/json',
		'Authorization': authAdminHeader
	}
};

/**
 * createEscrowCustomer.
 *
 * @returns {Object}
 * @param req
 * @param res
 */

exports.createEscrowCustomer = async (res, createCustomerParams) => {
	try {
		const response = await axios.post(`${ESCROW_API_ENDPOINT}/customer`, createCustomerParams, escrowAdminConfig);
		return response.data;
	} catch (err) {
		logger.error(err);
		return apiResponse.ErrorResponse(res, err);
	}
};

/**
 * createEscrowTransaction.
 *
 * @returns {Object}
 * @param req
 * @param res
 */

exports.createEscrowTransaction = async (res, orderInfo) => {
	try {
		// const authHeader = `Basic ${Buffer.from(`${orderInfo.client.user.email}:${ESCROW_API_KEY}`).toString('base64')}`;

		// const escrowConfig = {
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'Authorization': authHeader
		// 	}
		// };
		const createTransactionParams = {
			parties: [
				{
					role: 'buyer',
					// customer: 'me'
					customer: orderInfo.client.user.email
				},
				{
					role: 'seller',
					customer: orderInfo.service.provider.user.email
				}
			],
			currency: 'usd',
			description: orderInfo.order.caseDescription,
			items: [
				{
					title: orderInfo.service.serviceName,
					description: orderInfo.order.caseDescription,
					type: 'domain_name',
					inspection_period: 259200,
					quantity: 1,
					schedule: [
						{
							amount: 100.0,
							// payer_customer: 'me',
							payer_customer: orderInfo.client.user.email,
							beneficiary_customer: orderInfo.service.provider.user.email
						}
					]
				}
			]
		};
		// console.log(createTransactionParams);
		const response = await axios.post(`${ESCROW_API_ENDPOINT}/transaction`, createTransactionParams, escrowAdminConfig);
		console.log(JSON.stringify(response.data));
		// const updateData = {
		// 	action: 'agree'
		// };
		// try {
		// 	// const transactionRes = await axios.patch(`${ESCROW_API_ENDPOINT}/transaction/${response.data.id}`, updateData, escrowAdminConfig);
		// } catch (error) {
		// 	console.log('================>', error);
		// }
		// console.log('================>', transactionRes);
		// if (response.data) {
		// 	const agreePage = await axios.get(`${ESCROW_API_ENDPOINT}/transaction/${response.data.id}/web_link/agree`, updateData, escrowAdminConfig);
		// }
		return response.data;
	} catch (err) {
		logger.error(err);
		return apiResponse.ErrorResponse(res, err);
	}
};
/**
 * updateEscrowTransaction.
 *
 * @returns {Object}
 * @param req
 * @param res
 */

exports.updateEscrowTransaction = async (res, transactionId) => {
	try {
		const updateData = {
			action: 'agree'
		};
		const response = await axios.patch(`${ESCROW_API_ENDPOINT}/transaction/${transactionId}`, updateData, escrowAdminConfig);
		if (response.data) {
			const agreePage = await axios.patch(`${ESCROW_API_ENDPOINT}/transaction/${transactionId}/web_link/agree`, updateData, escrowAdminConfig);
			return agreePage.data;
		}
	} catch (err) {
		logger.error(err);
		return apiResponse.ErrorResponse(res, err);
	}
};

const { Invoice, Transaction } = require('../models');
const { faker } = require('@faker-js/faker');

module.exports = {
	up: async () => {
		const invoices = await Invoice.findAll({});

		for (const invoice of invoices) {
			await Transaction.create({
				clientId: invoice.clientId,
				invoiceId: invoice.id,
				providerId: invoice.providerId,
				orderId: invoice.orderId,
				tnxId: faker.helpers.replaceSymbols('**********'),
				invoicePath: faker.image.url(),
				transactionType: 'card',
				amount: invoice.amount,
				currency: invoice.currency,
				transactionStatus: 'completed',
				paymentMethod: 'credit_card'
			});
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('transactions', null, {});
	}
};

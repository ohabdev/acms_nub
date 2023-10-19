module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('transactions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			clientId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'clients',
					key: 'id'
				}
			},
			invoiceId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'invoices',
					key: 'id'
				}
			},
			providerId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'providers',
					key: 'id'
				}
			},
			orderId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'orders',
					key: 'id'
				}
			},
			tnxId: {
				type: Sequelize.STRING
			},
			invoicePath: {
				type: Sequelize.STRING
			},
			transactionType: {
				type: Sequelize.ENUM({
					values: ['cod', 'card', 'bank']
				})
			},
			amount: {
				type: Sequelize.FLOAT
			},
			currency: {
				type: Sequelize.STRING
			},
			transactionStatus: {
				type: Sequelize.ENUM({
					values: ['completed', 'incomplete']
				}),
				defaultValue: 'incomplete'
			},
			paymentMethod: {
				type: Sequelize.STRING
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
			}
		});
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable('transactions');
	}
};

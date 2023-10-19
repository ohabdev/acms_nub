module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('invoices', {
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
			amount: {
				type: Sequelize.FLOAT
			},
			currency: {
				type: Sequelize.STRING
			},
			status: {
				type: Sequelize.ENUM({
					values: ['paid', 'unpaid', 'partial']
				}),
				defaultValue: 'paid'
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
		await queryInterface.dropTable('invoices');
	}
};

'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('paymentInfos', {
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
					model: 'clients', // Assuming your clients table is named 'clients'
					key: 'id'
				}
			},
			customerId: {
				type: Sequelize.STRING,
				allowNull: false
			},
			gatewayType: {
				type: Sequelize.STRING
			},
			status: {
				type: Sequelize.STRING
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
		await queryInterface.dropTable('paymentInfos');
	}
};

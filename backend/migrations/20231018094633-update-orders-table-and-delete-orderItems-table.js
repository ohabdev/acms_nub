module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('orders', 'providerId', {
			type: Sequelize.INTEGER,
			allowNull: false
		});
		await queryInterface.addColumn('orders', 'serviceId', {
			type: Sequelize.INTEGER,
			allowNull: false
		});
		await queryInterface.addColumn('orders', 'opposingPartyName', { type: Sequelize.STRING });
		await queryInterface.dropTable('orderItems');
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('orders', 'opposingPartyName');
		await queryInterface.removeColumn('orders', 'providerId');
		await queryInterface.removeColumn('orders', 'serviceId');
		await queryInterface.createTable('orderItems', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			serviceId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			orderId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			price: {
				type: Sequelize.FLOAT,
				allowNull: true
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
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
	}
};

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('quotes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			serviceId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'services',
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
			price: {
				type: Sequelize.FLOAT,
				defaultValue: 0.0
			},
      serviceName: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('quotes');
	}
};

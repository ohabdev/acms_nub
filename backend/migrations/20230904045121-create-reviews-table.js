module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('reviews', {
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
			userType: {
				type: Sequelize.STRING
			},
			orderId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'orders',
					key: 'id'
				}
			},
			parentId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			rating: {
				type: Sequelize.INTEGER
			},
			review: {
				type: Sequelize.TEXT
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
		await queryInterface.dropTable('reviews');
	}
};

'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('conversations', {
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
					model: 'services', // Assuming your services table is named 'services'
					key: 'id'
				}
			},
			lastMessageId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			fromUserId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users', // Assuming your users table is named 'users'
					key: 'id'
				}
			},
			toUserId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users', // Assuming your users table is named 'users'
					key: 'id'
				}
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false // Default value if not specified
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
		await queryInterface.dropTable('conversations');
	}
};

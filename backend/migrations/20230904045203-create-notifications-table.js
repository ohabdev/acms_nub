'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('notifications', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
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
				allowNull: true,
				references: {
					model: 'users', // Assuming your users table is named 'users'
					key: 'id'
				}
			},
			entityId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			notificationType: {
				type: Sequelize.STRING
			},
			notificationMessage: {
				type: Sequelize.TEXT
			},
			isRead: {
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
		await queryInterface.dropTable('notifications');
	}
};

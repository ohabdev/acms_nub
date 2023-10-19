'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('messages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			conversationId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'conversations', // Assuming your conversations table is named 'conversations'
					key: 'id'
				}
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
			messageType: {
				type: Sequelize.ENUM({
					values: ['text', 'file']
				}),
				defaultValue: 'text'
			},
			message: {
				type: Sequelize.TEXT
			},
			attachment: {
				type: Sequelize.STRING // You can adjust the data type for attachment path as needed
			},
			isRead: {
				type: Sequelize.BOOLEAN,
				defaultValue: false // Default value if not specified
			},
			isDeletedByFromUser: {
				type: Sequelize.BOOLEAN,
				defaultValue: false // Default value if not specified
			},
			isDeletedByToUser: {
				type: Sequelize.BOOLEAN,
				defaultValue: false // Default value if not specified
			},
			isEdited: {
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
		await queryInterface.dropTable('messages');
	}
};

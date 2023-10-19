'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('orders', {
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
			appointmentDate: {
				type: Sequelize.DATE
			},
			duration: {
				type: Sequelize.INTEGER
			},
			isReminderSent: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			notes: {
				type: Sequelize.TEXT
			},
			serviceItems: {
				type: Sequelize.JSON
			},
			totalPrice: {
				type: Sequelize.FLOAT
			},
			status: {
				type: Sequelize.ENUM({
					values: ['init', 'approved', 'ongoing', 'completed']
				}),
				defaultValue: 'init'
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
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
		await queryInterface.dropTable('orders');
	}
};

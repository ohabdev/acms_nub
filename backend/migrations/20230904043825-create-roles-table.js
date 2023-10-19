'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('roles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			roleName: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			},
			isProvider: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isClient: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isSystemUser: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			createdBy: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			updatedBy: {
				type: Sequelize.INTEGER,
				allowNull: true
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
		await queryInterface.dropTable('roles');
	}
};

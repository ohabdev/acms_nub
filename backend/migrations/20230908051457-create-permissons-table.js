'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('permissions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			functionId: {
				type: Sequelize.INTEGER
			},
			roleId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'roles',
					key: 'id'
				}
			}
		});
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable('permissions');
	}
};

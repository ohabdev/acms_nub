'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('states', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
			code: {
				type: Sequelize.STRING,
				allowNull: true
			},
			latitude: {
				type: Sequelize.FLOAT
			},
			longitude: {
				type: Sequelize.FLOAT
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			countryId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'countries', // Assuming your country table is named 'countries'
					key: 'id'
				}
			},
			createdBy: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			updatedBy: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id'
				}
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
		await queryInterface.dropTable('states');
	}
};

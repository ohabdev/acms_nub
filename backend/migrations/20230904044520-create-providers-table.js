'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('providers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			experience: {
				type: Sequelize.STRING
			},
			certifications: {
				type: Sequelize.STRING
			},
			yearsOfExperience: {
				type: Sequelize.INTEGER
			},
			languages: {
				type: Sequelize.STRING
			},
			hourlyRate: {
				type: Sequelize.FLOAT
			},
			licenseInformation: {
				type: Sequelize.STRING
			},
			licenseValidation: {
				type: Sequelize.DATE
			},
			bio: {
				type: Sequelize.TEXT
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
			},
			parentId: {
				type: Sequelize.INTEGER
			}
		});
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable('providers');
	}
};

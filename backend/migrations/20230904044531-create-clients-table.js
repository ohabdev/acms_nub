'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('clients', {
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
					model: 'users', // Assuming your user table is named 'users'
					key: 'id'
				}
			},
			additionalDetails: {
				type: Sequelize.TEXT
			},
			identificationNumber: {
				type: Sequelize.STRING
			},
			emergencyContactName: {
				type: Sequelize.STRING
			},
			emergencyContactNumber: {
				type: Sequelize.STRING
			},
			maritalStatus: {
				type: Sequelize.STRING
			},
			spouseName: {
				type: Sequelize.STRING
			},
			preferredLanguage: {
				type: Sequelize.STRING
			},
			preferredContactMethod: {
				type: Sequelize.STRING
			},
			socialMediaProfiles: {
				type: Sequelize.STRING
			},
			primaryEmail: {
				type: Sequelize.STRING
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
		await queryInterface.dropTable('clients');
	}
};

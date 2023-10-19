'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			username: {
				type: Sequelize.STRING,
				allowNull: true,
				unique: true
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: true
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: true
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				required: true
			},
			password: {
				type: Sequelize.STRING,
				required: true
			},
			dob: {
				type: Sequelize.DATE
			},
			gender: {
				type: Sequelize.ENUM({
					values: ['male', 'female', 'others']
				}),
				defaultValue: 'male'
			},
			nationality: {
				type: Sequelize.STRING
			},
			authStrategy: {
				type: Sequelize.ENUM({
					values: ['local', 'facebook', 'google', 'apple', 'twitter']
				}),
				defaultValue: 'local'
			},
			roleId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'roles',
					key: 'id'
				}
			},
			profilePicture: {
				type: Sequelize.STRING
			},
			phoneNumber: {
				type: Sequelize.STRING
			},
			emailVerified: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			phoneVerified: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isProfileCompleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			accountStatus: {
				type: Sequelize.ENUM({
					values: ['pending', 'approved', 'rejected', 'suspended']
				}),
				defaultValue: 'pending'
			},
			countryId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			countyId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			stateId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			cityId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			latitude: {
				type: Sequelize.DOUBLE
			},
			longitude: {
				type: Sequelize.DOUBLE
			},
			address: {
				type: Sequelize.TEXT
			},
			zipCode: {
				type: Sequelize.STRING
			},
			passwordResetToken: {
				type: Sequelize.STRING,
				allowNull: true
			},
			isOnline: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			lastLoginTime: {
				type: Sequelize.DATE
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
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
		await queryInterface.dropTable('users');
	}
};

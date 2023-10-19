const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			username: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true
			},
			firstName: {
				type: DataTypes.STRING
			},
			lastName: {
				type: DataTypes.STRING
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				required: true
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true
			},
			dob: {
				type: DataTypes.DATE
			},
			gender: {
				type: DataTypes.ENUM({
					values: ['male', 'female', 'others']
				}),
				defaultValue: 'male'
			},
			nationality: {
				type: DataTypes.STRING
			},
			authStrategy: {
				type: DataTypes.ENUM({
					values: ['local', 'facebook', 'google', 'apple', 'twitter']
				}),
				defaultValue: 'local'
			},
			roleId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'Role',
					key: 'id'
				}
			},
			profilePicture: {
				type: DataTypes.STRING
			},
			phoneNumber: {
				type: DataTypes.STRING
			},
			emailVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			phoneVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isProfileCompleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			accountStatus: {
				type: DataTypes.ENUM({
					values: ['pending', 'approved', 'rejected', 'suspended']
				}),
				defaultValue: 'pending'
			},
			countryId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'Country',
					key: 'id'
				}
			},
			countyId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'County',
					key: 'id'
				}
			},
			stateId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'State',
					key: 'id'
				}
			},
			cityId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'City',
					key: 'id'
				}
			},
			zipCode: {
				type: DataTypes.STRING
			},
			isOnline: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			lastLoginTime: {
				type: DataTypes.DATE
			},
			latitude: {
				type: DataTypes.DOUBLE
			},
			longitude: {
				type: DataTypes.DOUBLE
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			address: {
				type: DataTypes.TEXT
			},
			passwordResetToken: {
				type: DataTypes.STRING,
				allowNull: true
			},
			emailVerificationToken: {
				type: DataTypes.STRING,
				allowNull: true
			},
			createdBy: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			updatedBy: {
				type: DataTypes.INTEGER,
				allowNull: true
			}
		},
		{
			tableName: 'users',
			timestamps: true,
			defaultScope: {
				attributes: { exclude: ['password', 'passwordResetToken', 'emailVerificationToken'] }
			},
			scopes: {
				withPassword: {
					attributes: { include: ['password', 'passwordResetToken', 'emailVerificationToken'] }
				}
			}
		}
	);

	User.beforeCreate(async (user) => {
		if (user.password) {
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(user.password, saltRounds);
			user.password = hashedPassword;
		}
	});

	User.prototype.toJSON = function () {
		const user = this.get();
		return _.omit(user, ['password', 'passwordResetToken', 'emailVerificationToken']);
	};

	User.prototype.comparePassword = async function (candidatePassword) {
		return bcrypt.compare(candidatePassword, this.password);
	};

	User.associate = function (models) {
		User.belongsTo(models.Role, {
			foreignKey: 'roleId',
			as: 'role'
		});

		User.hasOne(models.Provider, {
			foreignKey: 'userId',
			as: 'provider'
		});

		User.hasOne(models.Client, {
			foreignKey: 'userId',
			as: 'client'
		});
		User.belongsTo(models.Country, {
			foreignKey: 'countryId',
			as: 'country'
		});

		User.belongsTo(models.County, {
			foreignKey: 'countyId',
			as: 'county'
		});

		User.belongsTo(models.State, {
			foreignKey: 'stateId',
			as: 'state'
		});

		User.belongsTo(models.City, {
			foreignKey: 'cityId',
			as: 'city'
		});
	};

	return User;
};

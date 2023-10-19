module.exports = (sequelize, DataTypes) => {
	const ProviderType = sequelize.define(
		'ProviderType',
		{
			serviceTypeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'ServiceType',
					key: 'id'
				}
			},
			providerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Provider',
					key: 'id'
				}
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			createdBy: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'User',
					key: 'id'
				}
			},
			updatedBy: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'User',
					key: 'id'
				}
			}
		},
		{
			tableName: 'providerTypes',
			timestamps: true
		}
	);

	ProviderType.associate = function (models) {
		ProviderType.belongsTo(models.ServiceType, {
			foreignKey: 'serviceTypeId',
			as: 'serviceType'
		});

		ProviderType.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});

		ProviderType.belongsTo(models.User, {
			foreignKey: 'createdBy',
			as: 'createdByUser'
		});

		ProviderType.belongsTo(models.User, {
			foreignKey: 'updatedBy',
			as: 'updatedByUser'
		});
	};

	return ProviderType;
};

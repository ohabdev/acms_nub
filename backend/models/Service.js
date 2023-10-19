module.exports = (sequelize, DataTypes) => {
	const Service = sequelize.define(
		'Service',
		{
			serviceName: {
				type: DataTypes.STRING,
				allowNull: false,
				required: true
			},
			serviceTypeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'ServiceType',
					key: 'id'
				}
			},
			subServiceTypeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'ServiceType',
					key: 'id'
				}
			},
			availability: {
				type: DataTypes.ENUM({
					values: ['in-person', 'remote-only', 'both']
				})
			},
			countryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
				allowNull: false,
				references: {
					model: 'State',
					key: 'id'
				}
			},
			cityId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'City',
					key: 'id'
				}
			},
			street: {
				type: DataTypes.STRING
			},
			latitude: {
				type: DataTypes.FLOAT
			},
			longitude: {
				type: DataTypes.FLOAT
			},
			image: {
				type: DataTypes.STRING
			},
			providerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Provider',
					key: 'id'
				}
			},
			status: {
				type: DataTypes.ENUM({
					values: ['pending', 'approved', 'rejected']
				}),
				defaultValue: 'pending'
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			tableName: 'services',
			timestamps: true
		}
	);

	Service.associate = function (models) {
		Service.belongsTo(models.ServiceType, {
			foreignKey: 'serviceTypeId',
			as: 'serviceType'
		});
		Service.belongsTo(models.ServiceType, {
			foreignKey: 'subServiceTypeId',
			as: 'subServiceType'
		});

		Service.belongsTo(models.Country, {
			foreignKey: 'countryId',
			as: 'country'
		});

		Service.belongsTo(models.County, {
			foreignKey: 'countyId',
			as: 'county'
		});

		Service.belongsTo(models.State, {
			foreignKey: 'stateId',
			as: 'state'
		});

		Service.belongsTo(models.City, {
			foreignKey: 'cityId',
			as: 'city'
		});

		Service.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});
	};

	return Service;
};

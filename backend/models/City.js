module.exports = (sequelize, DataTypes) => {
	const City = sequelize.define(
		'City',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			countryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true,
				references: {
					model: 'Country',
					key: 'id'
				}
			},
			stateId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true,
				references: {
					model: 'State',
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
			latitude: {
				type: DataTypes.FLOAT
			},
			longitude: {
				type: DataTypes.FLOAT
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			timezone: {
				type: DataTypes.STRING
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
			tableName: 'cities',
			timestamps: true
		}
	);

	City.associate = function (models) {
		City.belongsTo(models.Country, {
			foreignKey: 'countryId',
			as: 'country'
		});

		City.hasOne(models.CityRate, {
			foreignKey: 'cityId',
			as: 'cityRate'
		});

		City.belongsTo(models.State, {
			foreignKey: 'stateId',
			as: 'state'
		});

		City.belongsTo(models.County, {
			foreignKey: 'countyId',
			as: 'county'
		});

		City.belongsTo(models.User, {
			foreignKey: 'createdBy',
			as: 'createdByUser'
		});

		City.belongsTo(models.User, {
			foreignKey: 'updatedBy',
			as: 'updatedByUser'
		});
	};

	return City;
};

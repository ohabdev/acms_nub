module.exports = (sequelize, DataTypes) => {
	const County = sequelize.define(
		'County',
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
			tableName: 'counties',
			timestamps: true
		}
	);

	County.associate = function (models) {
		County.belongsTo(models.Country, {
			foreignKey: 'countryId',
			as: 'country'
		});

		County.belongsTo(models.State, {
			foreignKey: 'stateId',
			as: 'state'
		});

		County.belongsTo(models.User, {
			foreignKey: 'createdBy',
			as: 'createdByUser'
		});

		County.belongsTo(models.User, {
			foreignKey: 'updatedBy',
			as: 'updatedByUser'
		});
	};

	return County;
};

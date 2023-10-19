module.exports = (sequelize, DataTypes) => {
	const State = sequelize.define(
		'State',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			code: {
				type: DataTypes.STRING,
				allowNull: true
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
			tableName: 'states',
			timestamps: true
		}
	);

	State.associate = function (models) {
		State.belongsTo(models.Country, {
			foreignKey: 'countryId',
			as: 'country'
		});

		State.belongsTo(models.User, {
			foreignKey: 'createdBy',
			as: 'createdByUser'
		});

		State.belongsTo(models.User, {
			foreignKey: 'updatedBy',
			as: 'updatedByUser'
		});
	};

	return State;
};

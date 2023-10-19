module.exports = (sequelize, DataTypes) => {
	const Country = sequelize.define(
		'Country',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			code: {
				type: DataTypes.STRING,
				allowNull: false
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
			tableName: 'countries',
			timestamps: true
		}
	);

	Country.associate = function (models) {
		Country.belongsTo(models.User, {
			foreignKey: 'createdBy',
			as: 'createdByUser'
		});

		Country.belongsTo(models.User, {
			foreignKey: 'updatedBy',
			as: 'updatedByUser'
		});
	};

	return Country;
};

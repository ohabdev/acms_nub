module.exports = (sequelize, DataTypes) => {
	const Quote = sequelize.define(
		'Quote',
		{
			serviceId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true,
				references: {
					model: 'Service',
					key: 'id'
				}
			},
            providerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true,
				references: {
					model: 'Provider',
					key: 'id'
				}
			},
			price: {
				type: DataTypes.FLOAT
			},
			serviceName: {
				type: DataTypes.STRING
			},
		},
		{
			tableName: 'quotes',
			timestamps: true
		}
	);

	Quote.associate = function (models) {
		Quote.belongsTo(models.Service, {
			foreignKey: 'serviceId',
			as: 'service'
		});

        Quote.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});
	};

	return Quote;
};

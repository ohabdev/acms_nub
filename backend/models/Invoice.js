module.exports = (sequelize, DataTypes) => {
	const Invoice = sequelize.define(
		'Invoice',
		{
			clientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Client',
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
			orderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Order',
					key: 'id'
				}
			},
			amount: {
				type: DataTypes.FLOAT
			},
			currency: {
				type: DataTypes.STRING
			},
			status: {
				type: DataTypes.ENUM({
					values: ['paid', 'unpaid', 'partial']
				}),
				defaultValue: 'paid'
			},
			isDeleted: {
				type: DataTypes.BOOLEAN
			}
		},
		{
			tableName: 'invoices',
			timestamps: true
		}
	);

	Invoice.associate = function (models) {
		Invoice.belongsTo(models.Client, {
			foreignKey: 'clientId',
			as: 'client'
		});

		Invoice.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});

		Invoice.belongsTo(models.Order, {
			foreignKey: 'orderId',
			as: 'order'
		});
	};

	return Invoice;
};

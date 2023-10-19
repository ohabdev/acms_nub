module.exports = (sequelize, DataTypes) => {
	const Transaction = sequelize.define(
		'Transaction',
		{
			clientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Client',
					key: 'id'
				}
			},
			invoiceId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Invoice',
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
			tnxId: {
				type: DataTypes.STRING
			},
			invoicePath: {
				type: DataTypes.STRING
			},
			transactionType: {
				type: DataTypes.ENUM({
					values: ['cod', 'card', 'bank']
				})
			},
			amount: {
				type: DataTypes.FLOAT
			},
			currency: {
				type: DataTypes.STRING
			},
			transactionStatus: {
				type: DataTypes.ENUM({
					values: ['completed', 'incomplete']
				}),
				defaultValue: 'incomplete'
			},
			paymentMethod: {
				type: DataTypes.STRING
			},
			isDeleted: {
				type: DataTypes.BOOLEAN
			}
		},
		{
			tableName: 'transactions',
			timestamps: true
		}
	);

	Transaction.associate = function (models) {
		Transaction.belongsTo(models.Client, {
			foreignKey: 'clientId',
			as: 'client'
		});

		Transaction.belongsTo(models.Invoice, {
			foreignKey: 'invoiceId',
			as: 'invoice'
		});

		Transaction.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});

		Transaction.belongsTo(models.Order, {
			foreignKey: 'orderId',
			as: 'order'
		});
	};

	return Transaction;
};

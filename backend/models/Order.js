module.exports = (sequelize, DataTypes) => {
	const Order = sequelize.define(
		'Order',
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
			serviceId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Service',
					key: 'id'
				}
			},
			opposingPartyName: {
				type: DataTypes.STRING
			},
			caseDescription: {
				type: DataTypes.TEXT
			},
			hearingDate: {
				type: DataTypes.DATEONLY
			},
			isCourtLocationKnown: {
				type: DataTypes.ENUM({
					values: ['YES', 'NO']
				})
			},
			isCourtLocationRemote: {
				type: DataTypes.ENUM({
					values: ['YES', 'NO']
				})
			},
			courtLocation: {
				type: DataTypes.STRING
			},
			isReminderSent: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			totalPrice: {
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
			status: {
				type: DataTypes.ENUM({
					values: ['init', 'approved', 'ongoing', 'completed']
				}),
				defaultValue: 'init'
			}
		},
		{
			tableName: 'orders',
			timestamps: true
		}
	);

	Order.associate = function (models) {
		Order.belongsTo(models.Client, {
			foreignKey: 'clientId',
			as: 'client'
		});
		Order.belongsTo(models.Service, {
			foreignKey: 'serviceId',
			as: 'service'
		});
		Order.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});
	};

	return Order;
};

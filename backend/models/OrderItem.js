module.exports = (sequelize, DataTypes) => {
	const OrderItem = sequelize.define(
		'OrderItem',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
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
				allowNull: false
			},
			orderId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			price: {
				type: DataTypes.FLOAT,
				allowNull: true
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			}
		},
		{
			tableName: 'orderItems',
			timestamps: true
		}
	);

	OrderItem.associate = function (models) {
		OrderItem.belongsTo(models.Service, {
			foreignKey: 'serviceId',
			as: 'service'
		});

		OrderItem.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});

		OrderItem.belongsTo(models.Order, {
			foreignKey: 'orderId',
			as: 'order'
		});
	};

	return OrderItem;
};

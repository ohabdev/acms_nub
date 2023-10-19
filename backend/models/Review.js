module.exports = (sequelize, DataTypes) => {
	const Review = sequelize.define(
		'Review',
		{
			clientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Client',
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
			providerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Provider',
					key: 'id'
				}
			},
			parentId: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			orderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Order',
					key: 'id'
				}
			},
			userType: {
				type: DataTypes.STRING
			},
			rating: {
				type: DataTypes.INTEGER
			},
			review: {
				type: DataTypes.TEXT
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			tableName: 'reviews',
			timestamps: true
		}
	);

	Review.associate = function (models) {
		Review.belongsTo(models.Client, {
			foreignKey: 'clientId',
			as: 'client'
		});

		Review.belongsTo(models.Service, {
			foreignKey: 'serviceId',
			as: 'service'
		});

		Review.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});

		Review.belongsTo(models.Order, {
			foreignKey: 'orderId',
			as: 'order'
		});
	};

	return Review;
};

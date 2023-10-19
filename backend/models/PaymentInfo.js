// Assuming you have Sequelize and sequelize instance set up

module.exports = (sequelize, DataTypes) => {
	const PaymentInfo = sequelize.define('PaymentInfo', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		clientId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		customerId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		gatewayType: {
			type: DataTypes.STRING
		},
		status: {
			type: DataTypes.STRING
		}
	});

	PaymentInfo.associate = function (models) {
		PaymentInfo.belongsTo(models.Client, {
			foreignKey: 'clientId',
			as: 'client'
		});
	};

	return PaymentInfo;
};

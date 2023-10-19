module.exports = (sequelize, DataTypes) => {
	const OtpVerification = sequelize.define(
		'OtpVerification',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			otp: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			expired: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
			},
			isVerified: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		},
		{
			tableName: 'otpVerifications',
			timestamps: true
		}
	);

	OtpVerification.associate = function (models) {
		OtpVerification.belongsTo(models.User, {
			foreignKey: 'userId',
			as: 'user'
		});
	};

	return OtpVerification;
};

module.exports = (sequelize, DataTypes) => {
	const Notification = sequelize.define(
		'Notification',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			fromUserId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			toUserId: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			entityId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			notificationType: {
				type: DataTypes.STRING
			},
			notificationMessage: {
				type: DataTypes.TEXT
			},
			isRead: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			tableName: 'notifications',
			timestamps: true
		}
	);

	Notification.associate = function (models) {
		Notification.belongsTo(models.User, { foreignKey: 'fromUserId', as: 'fromUser' });
		Notification.belongsTo(models.User, { foreignKey: 'toUserId', as: 'toUser' });
	};

	return Notification;
};

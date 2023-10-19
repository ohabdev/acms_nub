// Assuming you have Sequelize and sequelize instance set up

module.exports = (sequelize, DataTypes) => {
	const Message = sequelize.define(
		'Message',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			conversationId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			fromUserId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			toUserId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			messageType: {
				type: DataTypes.ENUM({
					values: ['text', 'file']
				}),
				defaultValue: 'text'
			},
			message: {
				type: DataTypes.TEXT
			},
			attachment: {
				type: DataTypes.STRING // You can adjust the data type for attachment path as needed
			},
			isRead: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isDeletedByFromUser: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isDeletedByToUser: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isEdited: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			tableName: 'messages',
			timestamps: true
		}
	);

	Message.associate = function (models) {
		Message.belongsTo(models.Conversation, {
			foreignKey: 'conversationId',
			as: 'conversation'
		});

		Message.belongsTo(models.User, {
			foreignKey: 'fromUserId',
			as: 'fromUser'
		});

		Message.belongsTo(models.User, {
			foreignKey: 'toUserId',
			as: 'toUser'
		});
	};

	return Message;
};

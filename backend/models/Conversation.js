module.exports = (sequelize, DataTypes) => {
	const Conversation = sequelize.define(
		'Conversation',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			serviceId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			lastMessageId: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			fromUserId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			toUserId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			tableName: 'conversations',
			timestamps: true
		}
	);

	Conversation.associate = function (models) {
		Conversation.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
		Conversation.belongsTo(models.User, { foreignKey: 'fromUserId', as: 'fromUser' });
		Conversation.belongsTo(models.User, { foreignKey: 'toUserId', as: 'toUser' });
		Conversation.belongsTo(models.Message, { foreignKey: 'lastMessageId', as: 'lastMessage' });
		Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'messages' });
	};

	return Conversation;
};

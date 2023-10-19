module.exports = (sequelize, DataTypes) => {
	const Client = sequelize.define(
		'Client',
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true,
				references: {
					model: 'User',
					key: 'id'
				}
			},
			additionalDetails: {
				type: DataTypes.TEXT
			},
			identificationNumber: {
				type: DataTypes.STRING
			},
			emergencyContactName: {
				type: DataTypes.STRING
			},
			emergencyContactNumber: {
				type: DataTypes.STRING
			},
			maritalStatus: {
				type: DataTypes.STRING
			},
			spouseName: {
				type: DataTypes.STRING
			},
			preferredLanguage: {
				type: DataTypes.STRING
			},
			preferredContactMethod: {
				type: DataTypes.STRING
			},
			socialMediaProfiles: {
				type: DataTypes.STRING
			},
			primaryEmail: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'clients',
			timestamps: true
		}
	);

	Client.associate = function (models) {
		Client.belongsTo(models.User, {
			foreignKey: 'userId',
			as: 'user'
		});
	};

	return Client;
};

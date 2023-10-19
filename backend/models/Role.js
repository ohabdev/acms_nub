module.exports = (sequelize, DataTypes) => {
	const Role = sequelize.define(
		'Role',
		{
			roleName: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				required: true
			},
			isProvider: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isClient: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isSystemUser: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			createdBy: {
				type: DataTypes.INTEGER
			},
			updatedBy: {
				type: DataTypes.INTEGER
			}
		},
		{
			tableName: 'roles',
			timestamps: true
		}
	);
	Role.associate = function (models) {
		Role.hasMany(models.Permission, {
			foreignKey: 'roleId',
			as: 'permission'
		});
	};
	return Role;
};

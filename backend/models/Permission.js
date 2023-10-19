module.exports = (sequelize, DataTypes) => {
	const Permission = sequelize.define(
		'Permission',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			functionId: {
				type: DataTypes.INTEGER,
				references: {
					model: 'Functions',
					key: 'id'
				}
			},
			roleId: {
				type: DataTypes.INTEGER,
				references: {
					model: 'Roles',
					key: 'id'
				}
			}
		},
		{
			tableName: 'permissions',
			timestamps: false
		}
	);

	Permission.associate = function (models) {
		Permission.belongsTo(models.Function, {
			foreignKey: 'functionId',
			as: 'function'
		});
	};

	return Permission;
};

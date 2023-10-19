module.exports = (sequelize, DataTypes) => {
	const Function = sequelize.define(
		'Function',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			path: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			method: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
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
				type: DataTypes.INTEGER,
				allowNull: true
			},
			updatedBy: {
				type: DataTypes.INTEGER,
				allowNull: true
			}
		},
		{
			tableName: 'functions',
			timestamp: true
		}
	);

	return Function;
};

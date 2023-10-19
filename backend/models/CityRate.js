module.exports = (sequelize, DataTypes) => {
	const CityRate = sequelize.define(
		'CityRate',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			cityId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true,
				references: {
					model: 'City',
					key: 'id'
				}
			},
			attorneyRate: {
				type: DataTypes.FLOAT,
				defaultValue: 0.0
			},
			paralegalRate: {
				type: DataTypes.FLOAT,
				defaultValue: 0.0
			},
			processServerRate: {
				type: DataTypes.FLOAT,
				defaultValue: 0.0
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
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
			tableName: 'cityRates',
			timestamps: true
		}
	);

	CityRate.associate = function (models) {
		CityRate.belongsTo(models.City, {
			foreignKey: 'cityId',
			as: 'city'
		});
	};

	return CityRate;
};

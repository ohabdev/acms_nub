module.exports = (sequelize, DataTypes) => {
	const Availability = sequelize.define(
		'Availability',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			providerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true,
				references: {
					model: 'providers',
					key: 'id'
				}
			},
			day: {
				type: DataTypes.ENUM({
					values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
				}),
				allowNull: false
			},
			startTimeFrom: {
				type: DataTypes.STRING,
				allowNull: true
			},
			toEndTime: {
				type: DataTypes.STRING,
				allowNull: true
			},
			isAcceptInstantBooking: {
				type: DataTypes.BOOLEAN,
				default: false
			}
		},
		{
			tableName: 'availabilities',
			timestamps: true
		}
	);

	Availability.associate = function (models) {
		Availability.belongsTo(models.Provider, {
			foreignKey: 'providerId',
			as: 'provider'
		});
	};

	return Availability;
};

module.exports = (sequelize, DataTypes) => {
	const Category = sequelize.define(
		'Category',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			image: {
				type: DataTypes.STRING
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
				allowNull: true,
				references: {
					model: 'User',
					key: 'id'
				}
			},
			updatedBy: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'User',
					key: 'id'
				}
			}
		},
		{
			tableName: 'categories',
			timestamps: true
		}
	);

	Category.associate = function (models) {
		Category.belongsTo(models.User, {
			foreignKey: 'createdBy',
			as: 'createdByUser'
		});

		Category.belongsTo(models.User, {
			foreignKey: 'updatedBy',
			as: 'updatedByUser'
		});
	};

	return Category;
};

module.exports = (sequelize, DataTypes) => {
	const ServiceType = sequelize.define(
		'ServiceType',
		{
			categoryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true
			},
			parentId: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			price: {
				type: DataTypes.FLOAT,
				allowNull: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			slug: {
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
			tableName: 'serviceTypes',
			timestamps: true
		}
	);

	ServiceType.associate = function (models) {
		ServiceType.belongsTo(models.Category, {
			foreignKey: 'categoryId',
			as: 'category'
		});

		ServiceType.belongsTo(models.User, {
			foreignKey: 'createdBy',
			as: 'createdByUser'
		});

		ServiceType.belongsTo(models.User, {
			foreignKey: 'updatedBy',
			as: 'updatedByUser'
		});
		// Add the self-referencing association for the parent-child relationship
		ServiceType.belongsTo(ServiceType, {
			foreignKey: 'parentId', // This is the foreign key that links child to parent
			as: 'parent' // This is the alias you can use to access the parent service type
		});

		// Add a hasMany association to represent the children of a service type
		ServiceType.hasMany(ServiceType, {
			foreignKey: 'parentId', // This links the parent to its children
			as: 'children' // This is the alias you can use to access the children of a service type
		});
	};

	return ServiceType;
};

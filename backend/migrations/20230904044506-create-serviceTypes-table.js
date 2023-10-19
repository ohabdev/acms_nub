module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('serviceTypes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			categoryId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'categories',
					key: 'id'
				}
			},
			parentId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			price: {
				type: Sequelize.FLOAT,
				allowNull: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			slug: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
			image: {
				type: Sequelize.STRING
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			createdBy: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			updatedBy: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
			}
		});
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable('serviceTypes');
	}
};

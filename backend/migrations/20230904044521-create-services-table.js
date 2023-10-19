module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('services', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			serviceName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			parentId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			categoryId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'categories',
					key: 'id'
				}
			},
			serviceTypeId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'serviceTypes',
					key: 'id'
				}
			},
			countryId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'countries',
					key: 'id'
				}
			},
			countyId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'counties',
					key: 'id'
				}
			},
			stateId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'states',
					key: 'id'
				}
			},
			cityId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'cities',
					key: 'id'
				}
			},
			street: {
				type: Sequelize.STRING
			},
			latitude: {
				type: Sequelize.FLOAT
			},
			longitude: {
				type: Sequelize.FLOAT
			},
			price: {
				type: Sequelize.FLOAT,
				allowNull: false
			},
			image: {
				type: Sequelize.STRING
			},
			providerId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'providers',
					key: 'id'
				}
			},
			status: {
				type: Sequelize.ENUM({
					values: ['pending', 'approved', 'rejected']
				}),
				defaultValue: 'pending'
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
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
		await queryInterface.dropTable('services');
	}
};

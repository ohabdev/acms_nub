module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('cities', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			latitude: {
				type: Sequelize.FLOAT
			},
			longitude: {
				type: Sequelize.FLOAT
			},
			timezone: {
				type: Sequelize.STRING
			},
			countryId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'countries',
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
			countyId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'counties',
					key: 'id'
				}
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
		await queryInterface.dropTable('cities');
	}
};

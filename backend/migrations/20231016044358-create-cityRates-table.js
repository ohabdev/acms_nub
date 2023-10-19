module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('cityRates', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			cityId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'cities',
					key: 'id'
				}
			},
			attorneyRate: {
				type: Sequelize.FLOAT,
				defaultValue: 0.0
			},
			paralegalRate: {
				type: Sequelize.FLOAT,
				defaultValue: 0.0
			},
			processServerRate: {
				type: Sequelize.FLOAT,
				defaultValue: 0.0
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			isDeleted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			createdBy: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			updatedBy: {
				type: Sequelize.INTEGER,
				allowNull: true
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
		await queryInterface.dropTable('cityRates');
	}
};

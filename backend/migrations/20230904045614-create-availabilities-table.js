module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('availabilities', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			providerId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'providers',
					key: 'id'
				}
			},
			day: {
				type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
				allowNull: false
			},
			startTimeFrom: {
				type: Sequelize.STRING,
				allowNull: true
			},
			toEndTime: {
				type: Sequelize.STRING,
				allowNull: true
			},
			isAcceptInstantBooking: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				default: false
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
		await queryInterface.dropTable('availabilities');
	}
};

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('orders', 'appointmentDate');
		await queryInterface.removeColumn('orders', 'duration');
		await queryInterface.removeColumn('orders', 'notes');
		await queryInterface.removeColumn('orders', 'serviceItems');

		await queryInterface.addColumn('orders', 'caseDescription', { type: Sequelize.TEXT });
		await queryInterface.addColumn('orders', 'hearingDate', { type: Sequelize.DATEONLY });
		await queryInterface.addColumn('orders', 'isCourtLocationKnown', {
			type: Sequelize.ENUM({ values: ['YES', 'NO'] })
		});
		await queryInterface.addColumn('orders', 'isCourtLocationRemote', {
			type: Sequelize.ENUM({ values: ['YES', 'NO'] })
		});
		await queryInterface.addColumn('orders', 'courtLocation', { type: Sequelize.STRING });
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('orders', 'appointmentDate', { type: Sequelize.DATE });
		await queryInterface.addColumn('orders', 'duration', { type: Sequelize.INTEGER });
		await queryInterface.addColumn('orders', 'notes', { type: Sequelize.TEXT });
		await queryInterface.addColumn('orders', 'serviceItems', { type: Sequelize.JSON });

		await queryInterface.removeColumn('orders', 'caseDescription');
		await queryInterface.removeColumn('orders', 'hearingDate');
		await queryInterface.removeColumn('orders', 'isCourtLocationKnown');
		await queryInterface.removeColumn('orders', 'isCourtLocationRemote');
		await queryInterface.removeColumn('orders', 'courtLocation');
	}
};

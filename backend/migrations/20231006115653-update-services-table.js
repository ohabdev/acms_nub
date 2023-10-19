module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('services', 'parentId');
		await queryInterface.removeColumn('services', 'categoryId');

		await queryInterface.addColumn('services', 'availability', {
			type: Sequelize.ENUM({ values: ['in-person', 'remote-only', 'both'] })
		});
		await queryInterface.addColumn('services', 'subServiceTypeId', { type: Sequelize.INTEGER });
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('services', 'parentId', { type: Sequelize.INTEGER });
		await queryInterface.addColumn('services', 'categoryId', { type: Sequelize.INTEGER });

		await queryInterface.removeColumn('services', 'availability');
		await queryInterface.removeColumn('services', 'subServiceTypeId');
	}
};

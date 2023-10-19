module.exports = {
	up: async (queryInterface) => {
		await queryInterface.removeColumn('services', 'price');
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('services', 'price', { type: Sequelize.FLOAT });
	}
};

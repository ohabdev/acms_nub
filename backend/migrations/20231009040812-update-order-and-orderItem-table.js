module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('orders', 'providerId');

		await queryInterface.addColumn('orderItems', 'providerId', { type: Sequelize.INTEGER });
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('orders', 'providerId', { type: Sequelize.INTEGER });

		await queryInterface.removeColumn('orderItems', 'providerId');
	}
};

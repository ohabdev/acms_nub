module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('users', 'emailVerificationToken', { type: Sequelize.STRING });
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('users', 'emailVerificationToken', { type: Sequelize.STRING });
	}
};

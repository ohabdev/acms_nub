module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('categories', [
			{
				name: 'Lawyers2go',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				name: 'Ineeda',
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('categories', null, {});
	}
};

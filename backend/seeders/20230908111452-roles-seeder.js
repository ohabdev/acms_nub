module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('roles', [
			{
				roleName: 'superAdmin',
				isSystemUser: true,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				roleName: 'admin',
				isSystemUser: true,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				roleName: 'provider',
				isProvider: true,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				roleName: 'client',
				isClient: true,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('roles', null, {});
	}
};

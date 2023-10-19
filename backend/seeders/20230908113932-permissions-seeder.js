const { Function, Role, Permission } = require('../models');

module.exports = {
	up: async () => {
		const functions = await Function.findAll();
		const roles = await Role.findAll();

		for (const role of roles) {
			for (const func of functions) {
				await Permission.create({
					roleId: role.id,
					functionId: func.id
				});
			}
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('permissions', null, {});
	}
};

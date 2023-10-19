const { Availability, Provider } = require('../models');

module.exports = {
	up: async () => {
		const provider = await Provider.findOne();
		const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

		for (const day of days) {
			await Availability.create({
				providerId: provider.id,
				day: day,
				startTimeFrom: '9 AM',
				toEndTime: '6:00 PM',
				userType: 'client',
				isAcceptInstantBooking: false
			});
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('availabilities', null, {});
	}
};

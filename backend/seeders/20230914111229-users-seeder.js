const { Role, User, Provider, Client, ServiceType, ProviderType, City } = require('../models');
const { faker } = require('@faker-js/faker');
const appName = process.env.APP_NAME;

module.exports = {
	up: async () => {
		try {
			const roles = await Role.findAll();
			const city = await City.findOne();

			let serviceTypeSlug;
			if (appName == 'Lawyers2go') {
				serviceTypeSlug = 'attorney';
			} else {
				serviceTypeSlug = 'hairStylists';
			}
			const serviceType = await ServiceType.findOne({ where: { slug: serviceTypeSlug } });
			for (const role of roles) {
				const user = await User.create({
					username: faker.internet.userName(),
					firstName: faker.person.firstName(),
					lastName: faker.person.lastName(),
					email: `${role.roleName.toLowerCase()}@example.com`,
					password: 'password@321',
					roleId: role.id,
					phoneNumber: faker.phone.number('501-###-####'),
					emailVerified: true,
					phoneVerified: true,
					accountStatus: 'approved',
					countryId: city.countryId,
					countyId: city.countyId,
					stateId: city.stateId,
					cityId: city.id,
					zipCode: faker.location.zipCode(),
					isOnline: false,
					isActive: true,
					isDeleted: false,
					address: `${faker.location.streetAddress(true)}, ${faker.location.city()}`,
					createdAt: new Date()
				});

				if (role.roleName == 'provider') {
					const provider = await Provider.create({
						userId: user.id,
						stateBarNumber: `${faker.finance.accountNumber(10)}`,
						proofOfMalpracticeInsurance: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg',
						appearanceAvailability: 'both',
						proofOfParalegalCertification: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg',
						attorneyVerificationLetter: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg',
						proofOfCertification: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg',
						proofOfBusinessLicense: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg',
						yearsOfPractice: '1-10',
						officeAddress: `${faker.location.streetAddress(true)}, ${faker.location.city()}`,
						termsOfAgreement: 'photos/medium/single-download--1--a10218e3-ffa7-4535-970c-a41bcc9fbdae.jpeg',
						createdAt: new Date()
					});

					await ProviderType.create({
						providerId: provider.id,
						serviceTypeId: serviceType.id,
						createdAt: new Date()
					});
				}

				if (role.roleName == 'client') {
					await Client.create({
						userId: user.id,
						additionalDetails: faker.lorem.lines(4),
						identificationNumber: `${faker.finance.accountNumber(10)}`,
						emergencyContactName: `${faker.person.firstName()} ${faker.person.lastName()}`,
						emergencyContactNumber: faker.phone.number('501-###-####'),
						maritalStatus: 'YES',
						spouseName: `${faker.person.firstName()} ${faker.person.lastName()}`,
						preferredLanguage: 'English',
						preferredContactMethod: 'Escrow',
						socialMediaProfiles: 'www.facebook.com',
						primaryEmail: faker.internet.email({ provider: 'example.com' }),
						createdAt: new Date()
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('providerTypes', null, {});
		await queryInterface.bulkDelete('providers', null, {});
		await queryInterface.bulkDelete('clients', null, {});
		await queryInterface.bulkDelete('cities', null, {});
		await queryInterface.bulkDelete('notifications', null, {});
		await queryInterface.bulkDelete('users', null, {});
	}
};

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('providers', 'experience');
		await queryInterface.removeColumn('providers', 'certifications');
		await queryInterface.removeColumn('providers', 'yearsOfExperience');
		await queryInterface.removeColumn('providers', 'languages');
		await queryInterface.removeColumn('providers', 'hourlyRate');
		await queryInterface.removeColumn('providers', 'licenseInformation');
		await queryInterface.removeColumn('providers', 'licenseValidation');
		await queryInterface.removeColumn('providers', 'bio');
		await queryInterface.addColumn('providers', 'stateBarNumber', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'proofOfMalpracticeInsurance', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'appearanceAvailability', {
			type: Sequelize.ENUM({ values: ['in-person', 'remote-only', 'both'] })
		});
		await queryInterface.addColumn('providers', 'proofOfParalegalCertification', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'attorneyVerificationLetter', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'proofOfCertification', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'proofOfBusinessLicense', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'yearsOfPractice', {
			type: Sequelize.ENUM({ values: ['1-10', '11-20', '21-30', '30+'] })
		});
		await queryInterface.addColumn('providers', 'officeAddress', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'termsOfAgreement', { type: Sequelize.STRING });
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('providers', 'experience', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'certifications', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'yearsOfExperience', { type: Sequelize.INTEGER });
		await queryInterface.addColumn('providers', 'languages', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'hourlyRate', { type: Sequelize.FLOAT });
		await queryInterface.addColumn('providers', 'licenseInformation', { type: Sequelize.STRING });
		await queryInterface.addColumn('providers', 'licenseValidation', { type: Sequelize.DATE });
		await queryInterface.addColumn('providers', 'bio', { type: Sequelize.TEXT });
		// To remove columns, you can use queryInterface.removeColumn
		await queryInterface.removeColumn('providers', 'stateBarNumber');
		await queryInterface.removeColumn('providers', 'proofOfMalpracticeInsurance');
		await queryInterface.removeColumn('providers', 'appearanceAvailability');
		await queryInterface.removeColumn('providers', 'proofOfParalegalCertification');
		await queryInterface.removeColumn('providers', 'attorneyVerificationLetter');
		await queryInterface.removeColumn('providers', 'proofOfCertification');
		await queryInterface.removeColumn('providers', 'proofOfBusinessLicense');
		await queryInterface.removeColumn('providers', 'yearsOfPractice');
		await queryInterface.removeColumn('providers', 'officeAddress');
		await queryInterface.removeColumn('providers', 'termsOfAgreement');
	}
};

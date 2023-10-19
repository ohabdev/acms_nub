module.exports = (sequelize, DataTypes) => {
	const Provider = sequelize.define(
		'Provider',
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				required: true,
				references: {
					model: 'User',
					key: 'id'
				}
			},
			stateBarNumber: {
				type: DataTypes.STRING
			},
			proofOfMalpracticeInsurance: {
				type: DataTypes.STRING
			},
			appearanceAvailability: {
				type: DataTypes.ENUM({
					values: ['in-person', 'remote-only', 'both']
				})
			},
			proofOfParalegalCertification: {
				type: DataTypes.STRING
			},
			attorneyVerificationLetter: {
				type: DataTypes.STRING
			},
			proofOfCertification: {
				type: DataTypes.STRING
			},
			proofOfBusinessLicense: {
				type: DataTypes.STRING
			},
			yearsOfPractice: {
				type: DataTypes.ENUM({
					values: ['1-10', '11-20', '21-30', '30+']
				})
			},
			officeAddress: {
				type: DataTypes.STRING
			},
			termsOfAgreement: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'providers',
			timestamps: true
		}
	);

	Provider.associate = function (models) {
		Provider.belongsTo(models.User, {
			foreignKey: 'userId',
			as: 'user'
		});
		Provider.hasMany(models.Review, {
			foreignKey: 'providerId',
			as: 'reviews'
		});
		Provider.hasMany(models.Service, {
			foreignKey: 'providerId',
			as: 'services'
		});
		Provider.hasOne(models.ProviderType, {
			foreignKey: 'providerId',
			as: 'providerType'
		});
		Provider.hasMany(models.Availability, {
			foreignKey: 'providerId',
			as: 'availability'
		});
	};

	return Provider;
};

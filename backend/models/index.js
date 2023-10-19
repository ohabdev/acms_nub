const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const configFile = require('../config/config');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], {
		...config,
		define: {
			// sync: false,
			defaultScope: {
				attributes: {
					exclude: ['password', 'passwordResetToken', 'emailVerificationToken']
				}
			},

			// underscored: true,
			timestamps: true
		}
	});
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, {
		...config,
		define: {
			defaultScope: {
				attributes: {
					exclude: ['password', 'passwordResetToken', 'emailVerificationToken']
				}
			},
			// sync: false,
			// underscored: true,
			timestamps: true
		}
	});
}

fs.readdirSync(__dirname)
	.filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
	.forEach((file) => {
		const modelFunction = require(path.join(__dirname, file));
		const model = modelFunction(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((key) => {
	if (db[key].associate) {
		db[key].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

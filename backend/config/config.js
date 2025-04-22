require('dotenv').config();

module.exports = {
	use_env_variable: true,
	development: {
		username: process.env.DATABASE_USERNAME || 'root',
		password: process.env.DATABASE_PASSWORD || '',
		database: process.env.DATABASE_NAME || 'acms_nub',
		host: process.env.DATABASE_HOSTNAME || 'localhost',
		port: 3306,
		dialect: 'mysql',
		logging: true,
		seederStorage: 'sequelize'
	},
	test: {
		username: process.env.DATABASE_USERNAME || 'root',
		password: process.env.DATABASE_PASSWORD || 'new_password',
		database: process.env.DATABASE_NAME || '',
		host: process.env.DATABASE_HOSTNAME || 'localhost',
		port: 3306,
		dialect: 'mysql',
		logging: true
	},
	production: {
		username: process.env.DATABASE_USERNAME || 'root',
		password: process.env.DATABASE_PASSWORD || 'secret',
		database: process.env.DATABASE_NAME || 'ineeda',
		host: process.env.DATABASE_HOSTNAME || '172.22.0.2',
		port: 3306,
		dialect: 'mysql',
		logging: true
	}
};

const { category } = require('./admin/categories.test');
const { city } = require('./admin/city.test');
const { country } = require('./admin/country.test');
const { county } = require('./admin/county.test');
const { orders } = require('./admin/orders.test');
const { serviceType, subServiceTypes } = require('./admin/serviceType.test');
const { state } = require('./admin/state.test');
const { users } = require('./admin/user.test');
const { role } = require('./admin/role.test');
const { func } = require('./admin/func.test');
const { cityRate } = require('./admin/cityRate.test');

exports.systemUser = async (app, token) => {
	await func(app, token);
	await role(app, token);
	await country(app, token);
	await state(app, token);
	await county(app, token);
	await city(app, token);
	await category(app, token);
	await serviceType(app, token);
	await subServiceTypes(app, token);
	await orders(app, token);
	await users(app, token);
	await cityRate(app, token);
};

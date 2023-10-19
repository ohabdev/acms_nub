const { order } = require('./provider/order.test');
const { service } = require('./provider/service.test');
const { user } = require('./provider/user.test');

exports.provider = async (app, token) => {
	await user(app, token);
	await order(app, token);
	await service(app, token);
};

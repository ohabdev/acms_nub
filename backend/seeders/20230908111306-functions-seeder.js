module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('functions', [
			{
				name: 'User register',
				path: '/auth/register',
				method: 'POST'
			},
			{
				name: 'User login',
				path: '/auth/login',
				method: 'POST'
			},
			{
				name: 'Category list',
				path: '/category/',
				method: 'GET'
			},
			{
				name: 'Category details',
				path: '/category/:id',
				method: 'GET'
			},
			{
				name: 'Category update',
				path: '/category/:id',
				method: 'PUT'
			},
			{
				name: 'Category delete',
				path: '/category/:id',
				method: 'DELETE'
			},
			{
				name: 'Category create',
				path: '/category/create',
				method: 'POST'
			},
			{
				name: 'Role list',
				path: '/role/',
				method: 'GET'
			},
			{
				name: 'Role details',
				path: '/role/:id',
				method: 'GET'
			},
			{
				name: 'Role update',
				path: '/role/:id',
				method: 'PUT'
			},
			{
				name: 'Role DELETE',
				path: '/role/:id',
				method: 'DELETE'
			},
			{
				name: 'Role create',
				path: '/role/create',
				method: 'POST'
			},
			{
				name: 'Get current user details',
				path: '/users/me',
				method: 'GET'
			},
			{
				name: 'User update',
				path: '/users/',
				method: 'PUT'
			},
			{
				name: 'User update profile by id',
				path: '/users/:id',
				method: 'PUT'
			},
			{
				name: 'Client profile update',
				path: '/users/client',
				method: 'PUT'
			},
			{
				name: 'Provider profile update',
				path: '/users/provider',
				method: 'PUT'
			},
			{
				name: 'User type update',
				path: '/users/user-type',
				method: 'POST'
			},
			{
				name: 'Provider type update',
				path: '/users/provider-type',
				method: 'POST'
			},
			{
				name: 'get provider type',
				path: '/users/provider-type',
				method: 'GET'
			},
			{
				name: 'Send otp',
				path: '/users/send-otp',
				method: 'POST'
			},
			{
				name: 'changed password',
				path: '/users/change-password',
				method: 'POST'
			},
			{
				name: 'Verify Otp',
				path: '/users/verify-otp',
				method: 'POST'
			},
			{
				name: 'Users list',
				path: '/users/',
				method: 'GET'
			},
			{
				name: 'Users Delete',
				path: '/users/:id',
				method: 'DELETE'
			},
			{
				name: 'Get Single user Details',
				path: '/users/:id',
				method: 'GET'
			},
			{
				name: 'Get provider Details',
				path: '/users/provider/:id',
				method: 'GET'
			},
			{
				name: 'Forgot password',
				path: '/users/forgot-password',
				method: 'POST'
			},
			{
				name: 'Reset password',
				path: '/users/reset-password',
				method: 'POST'
			},
			{
				name: 'Country list',
				path: '/country/',
				method: 'GET'
			},
			{
				name: 'Country details',
				path: '/country/:id',
				method: 'GET'
			},
			{
				name: 'Country update',
				path: '/country/:id',
				method: 'PUT'
			},
			{
				name: 'Country delete',
				path: '/country/:id',
				method: 'DELETE'
			},
			{
				name: 'Country create',
				path: '/country/create',
				method: 'POST'
			},
			{
				name: 'State list',
				path: '/state/',
				method: 'GET'
			},
			{
				name: 'State details',
				path: '/state/:id',
				method: 'GET'
			},
			{
				name: 'State update',
				path: '/state/:id',
				method: 'PUT'
			},
			{
				name: 'State delete',
				path: '/state/:id',
				method: 'DELETE'
			},
			{
				name: 'State create',
				path: '/state/create',
				method: 'POST'
			},
			{
				name: 'County list',
				path: '/county/',
				method: 'GET'
			},
			{
				name: 'County details',
				path: '/county/:id',
				method: 'GET'
			},
			{
				name: 'County update',
				path: '/county/:id',
				method: 'PUT'
			},
			{
				name: 'County delete',
				path: '/county/:id',
				method: 'DELETE'
			},
			{
				name: 'County create',
				path: '/county/create',
				method: 'POST'
			},
			{
				name: 'City list',
				path: '/city/',
				method: 'GET'
			},
			{
				name: 'City details',
				path: '/city/:id',
				method: 'GET'
			},
			{
				name: 'City update',
				path: '/city/:id',
				method: 'PUT'
			},
			{
				name: 'City delete',
				path: '/city/:id',
				method: 'DELETE'
			},
			{
				name: 'City create',
				path: '/city/create',
				method: 'POST'
			},
			{
				name: 'Function list',
				path: '/function/',
				method: 'GET'
			},
			{
				name: 'Function details',
				path: '/function/:id',
				method: 'GET'
			},
			{
				name: 'Function update',
				path: '/function/:id',
				method: 'PUT'
			},
			{
				name: 'Function delete',
				path: '/function/:id',
				method: 'DELETE'
			},
			{
				name: 'Function create',
				path: '/function/create',
				method: 'POST'
			},
			{
				name: 'Service list',
				path: '/service/',
				method: 'GET'
			},
			{
				name: 'Service details',
				path: '/service/:id',
				method: 'GET'
			},
			{
				name: 'Service update',
				path: '/service/:id',
				method: 'PUT'
			},
			{
				name: 'Service delete',
				path: '/service/:id',
				method: 'DELETE'
			},
			{
				name: 'Service create',
				path: '/service/create',
				method: 'POST'
			},
			{
				name: 'Service Types list',
				path: '/serviceType/',
				method: 'GET'
			},
			{
				name: 'Sub Service Types list',
				path: '/serviceType/sub-serviceTypes',
				method: 'GET'
			},
			{
				name: 'Service Types details',
				path: '/serviceType/:id',
				method: 'GET'
			},
			{
				name: 'Service Types update',
				path: '/serviceType/:id',
				method: 'PUT'
			},
			{
				name: 'Service Types delete',
				path: '/serviceType/:id',
				method: 'DELETE'
			},
			{
				name: 'Service Types create',
				path: '/serviceType/create',
				method: 'POST'
			},
			{
				name: 'Order create',
				path: '/order/create',
				method: 'POST'
			},
			{
				name: 'Order list',
				path: '/order/',
				method: 'GET'
			},
			{
				name: 'Provider orders list',
				path: '/order/provider',
				method: 'GET'
			},
			{
				name: 'Client orders list',
				path: '/order/client',
				method: 'GET'
			},
			{
				name: 'Order details',
				path: '/order/:id',
				method: 'GET'
			},
			{
				name: 'Order update',
				path: '/order/:id',
				method: 'PUT'
			},
			{
				name: 'Order delete',
				path: '/order/:id',
				method: 'DELETE'
			},
			{
				name: 'Invoice create',
				path: '/invoice/create',
				method: 'POST'
			},
			{
				name: 'Invoice list',
				path: '/invoice/',
				method: 'GET'
			},
			{
				name: 'Invoice details',
				path: '/invoice/:id',
				method: 'GET'
			},
			{
				name: 'Invoice update',
				path: '/invoice/:id',
				method: 'PUT'
			},
			{
				name: 'Invoice delete',
				path: '/invoice/:id',
				method: 'DELETE'
			},
			{
				name: 'Transaction list',
				path: '/transaction/',
				method: 'GET'
			},
			{
				name: 'Transaction details',
				path: '/transaction/:id',
				method: 'GET'
			},
			{
				name: 'Transaction update',
				path: '/transaction/:id',
				method: 'PUT'
			},
			{
				name: 'Transaction delete',
				path: '/transaction/:id',
				method: 'DELETE'
			},
			{
				name: 'Transaction create',
				path: '/transaction/create',
				method: 'POST'
			},
			{
				name: 'Review create',
				path: '/review/create',
				method: 'POST'
			},
			{
				name: 'Review list',
				path: '/review/',
				method: 'GET'
			},
			{
				name: 'Review details',
				path: '/review/:id',
				method: 'GET'
			},
			{
				name: 'Review update',
				path: '/review/:id',
				method: 'PUT'
			},
			{
				name: 'Review delete',
				path: '/review/:id',
				method: 'DELETE'
			},
			{
				name: 'Notification list',
				path: '/notification/',
				method: 'GET'
			},
			{
				name: 'Conversation list',
				path: '/conversation/create',
				method: 'POST'
			},
			{
				name: 'Get All Messages by conversion id',
				path: '/conversation/get-all-messages-by-conversion/:id',
				method: 'GET'
			},
			{
				name: 'Message create',
				path: '/message/create',
				method: 'POST'
			},
			{
				name: 'Availability create',
				path: '/availability/create',
				method: 'POST'
			},
			{
				name: 'Availability list',
				path: '/availability/',
				method: 'GET'
			},
			{
				name: 'Availability details',
				path: '/availability/:id',
				method: 'GET'
			},
			{
				name: 'Availability update',
				path: '/availability/:id',
				method: 'PUT'
			},
			{
				name: 'Availability delete',
				path: '/availability/:id',
				method: 'DELETE'
			}
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('functions', null, {});
	}
};

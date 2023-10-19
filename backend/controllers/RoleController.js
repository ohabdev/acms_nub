const { createRoleSchema, updateRoleSchema } = require('../validators/role');
const { Role, Permission, Function } = require('../models');
const apiResponse = require('../helpers/apiResponse');
const logger = require('../helpers/logger');

const path = require('path');
const fileName = path.basename(__filename);

// Create a new role
exports.create = async (req, res) => {
	const name = 'create';
	try {
		logger.info(`${fileName}->${name} function role get data from client ${JSON.stringify(req.body)}`);
		req.body.createdBy = req?.user?.id;
		const validate = createRoleSchema.validate(req.body);
		if (validate.error) {
			throw new Error(validate.error);
		}
		const role = await Role.create(validate.value);

		// Create associated permissions
		if (validate?.value?.permissions && validate?.value?.permissions?.length > 0) {
			const permissionPromises = validate?.value?.permissions?.map(async (permission) => {
				const functionId = permission?.functionId;
				await Permission.create({
					roleId: role.id,
					functionId
				});
			});
			await Promise.all(permissionPromises);
		}
		logger.info(`${fileName}->${name} Role successfully created and return object ${JSON.stringify(role)}`);
		return apiResponse.successResponseWithData(res, 'Role successfully created', role);
	} catch (err) {
		if (err?.errors?.length > 0) {
			err.message = err?.errors[0]?.message;
		}
		logger.error(`${fileName}->${name} Role successfully not created and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get all roles
exports.getAllRoles = async (req, res) => {
	const name = 'getAllRoles';
	try {
		logger.info(`${fileName}->${name} param get from client ${JSON.stringify(req.query)}`);
		const limit = parseInt(req?.query?.limit) || 10;
		const offset = parseInt(req?.query?.page) * limit || 0;
		logger.info(`${fileName}->${name} limit =${limit} and offset=${offset} for fetch data from database }`);

		const roles = await Role.findAndCountAll({
			where: {
				isDeleted: false
			},
			limit,
			offset,
			order: [['createdAt', 'DESC']],
			include: [
				{
					model: Permission,
					as: 'permission',
					include: [
						{
							model: Function,
							as: 'function'
						}
					]
				}
			]
		});
		logger.info(`${fileName}->${name} data successfully fetched ${JSON.stringify(roles)}`);
		return apiResponse.successResponseWithData(res, 'Data successfully fetched', roles);
	} catch (err) {
		logger.error(`${fileName}->${name} data successfully not fetch return error = ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a role by ID
exports.getSingleRole = async (req, res) => {
	const roleId = req.params.id;
	const name = 'getRoleById';
	try {
		const role = await Role.findByPk(roleId, {
			include: [
				{
					model: Permission,
					as: 'permission',
					include: [
						{
							model: Function,
							as: 'function'
						}
					]
				}
			]
		});

		if (!role) {
			throw new Error('Role not found');
		} else {
			logger.info(`${fileName}->${name} data successfully fetched ${JSON.stringify(role)}`);
			return apiResponse.successResponseWithData(res, 'Data successfully fetched', role);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} data successfully not fetch return error = ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Get a systemRoles
exports.systemRoles = async (req, res) => {
	const name = 'systemRoles';
	try {
		const roles = await Role.findAndCountAll({ where: { isSystemUser: true } });

		if (!roles) {
			throw new Error('Role not found');
		} else {
			logger.info(`${fileName}->${name} data successfully fetched ${JSON.stringify(roles)}`);
			return apiResponse.successResponseWithData(res, 'Data successfully fetched', roles);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} data successfully not fetch return error = ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Update a role by ID
exports.update = async (req, res) => {
	const roleId = req.params.id;
	const name = 'update';
	try {
		const role = await Role.findByPk(roleId);

		if (!role) {
			throw new Error('Role not found');
		} else {
			logger.info(`${fileName}->${name}  function get data from client ${JSON.stringify(req.body)}`);
			req.body.updatedBy = req?.user?.id;
			const validate = updateRoleSchema.validate(req.body);
			if (validate.error) {
				throw new Error(validate.error);
			}
			await role.update(validate.value);
			await Permission.destroy({ where: { roleId } });
			if (validate?.value?.permissions && validate?.value?.permissions?.length > 0) {
				const permissionPromises = validate?.value?.permissions.map(async (permission) => {
					const functionId = permission?.functionId;
					await Permission.create({
						roleId,
						functionId
					});
				});
				await Promise.all(permissionPromises);
			}

			const updateRole = await Role.findByPk(roleId, {
				include: [
					{
						model: Permission,
						as: 'permission',
						include: [
							{
								model: Function,
								as: 'function'
							}
						]
					}
				]
			});

			logger.info(`${fileName}->${name} Role successfully updated and return object ${JSON.stringify(role)}`);
			return apiResponse.successResponseWithData(res, 'Role successfully updated', updateRole);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} data successfully not fetch return error = ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Delete a role by ID
exports.delete = async (req, res) => {
	const name = 'deleteCity';
	try {
		const role = await Role.findOne({
			where: {
				isDeleted: false,
				id: req.params.id
			}
		});
		if (!role) {
			throw new Error('Role not found');
		} else {
			await Role.update(
				{
					isDeleted: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);
			logger.info(`${fileName}->${name} Role successfully deleted and return object ${JSON.stringify(role)}`);
			return apiResponse.successResponseWithData(res, 'Role successfully deleted', role);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Role successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

// Hard Delete a role by ID
exports.hardDelete = async (req, res) => {
	const name = 'hardDelete';
	try {
		const role = await Role.findOne({
			where: {
				id: req.params.id
			}
		});
		if (!role) {
			throw new Error('Role not found');
		} else {
			await Permission.destroy({ where: { roleId: role.id } });
			await role.destroy();
			logger.info(`${fileName}->${name} Role successfully deleted and return object ${JSON.stringify(role)}`);
			return apiResponse.successResponseWithData(res, 'Role successfully deleted', role);
		}
	} catch (err) {
		logger.error(`${fileName}->${name} Role successfully not Deleted and return error ${JSON.stringify(err)}`);
		return apiResponse.ErrorResponse(res, err.message);
	}
};

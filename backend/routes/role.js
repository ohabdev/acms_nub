const RoleController = require('../controllers/RoleController');
const auth = require('../middleware/jwt');
const express = require('express');
const router = express.Router();

router.get('/', RoleController.getAllRoles);
router.get('/system-roles', auth(), RoleController.systemRoles);
router.get('/:id', auth(), RoleController.getSingleRole);
router.put('/:id', auth(), RoleController.update);
router.delete('/:id', auth(), RoleController.delete);
router.post('/create/', auth(), RoleController.create);
router.delete('/hard-delete/:id', auth(), RoleController.hardDelete);

module.exports = router;

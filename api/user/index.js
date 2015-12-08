var express = require('express');
var controller = require('./users.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/login?:params', controller.login);
router.get('/:id', controller.show);
router.get('/age/:delim/:age', controller.getAges);
router.post('/', controller.create);
router.put('/:id/addToUser', controller.addToUser);
router.post('/:id/:modId/addAssign', controller.addAssign);
router.put('/:id/:modId/updateAssign/:assignId', controller.updateAssign);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.delete('/:id/deleteFromUser/:modId', controller.deleteFromUser);
router.delete('/:id/:modId/deleteAssign/:assignId', controller.deleteAssign);

module.exports = router;
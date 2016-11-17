let Router = require('./core/router');
let router = new Router();

router.get('/devices', 'DeviceController.list');
router.post('/devices', 'DeviceController.create');
router.destroy('/devices/:id', 'DeviceController.delete');
router.patch('/devices/:id/control', 'DeviceController.control');

module.exports = router;
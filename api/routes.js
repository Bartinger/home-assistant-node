let Router = require('./core/router');
let router = new Router();

let deviceController = require('./controllers/device-controller');

router.get('/devices', 'devices.list', deviceController.list);
router.post('/devices', 'devices.create', deviceController.create);
router.delete('/devices/:id', 'devices.create', deviceController.delete);
router.patch('/devices/:id/control', 'devices.create', deviceController.control);

module.exports = router;
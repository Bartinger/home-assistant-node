let Router = require('./core/router');
let router = new Router();

let deviceController = require('./controllers/device-controller');

router.get('/devices', 'devices.list', deviceController.list);
router.post('/devices', 'devices.create', deviceController.create);

module.exports = router;
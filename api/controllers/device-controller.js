let repo = require('../repositories/device-repository');
let BaseController = require('../core/base-controller');

class DeviceController extends BaseController {

	list(req, res) {
		return repo.list()
			.then((devices) => {
				res.send(devices);
			})
	}

	create(req, res) {
		return repo.save(req.body)
			.then((data) => {
				res.send(data);
			})


	}

}

module.exports = new DeviceController();
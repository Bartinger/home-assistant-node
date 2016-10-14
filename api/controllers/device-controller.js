let repo = require('../repositories/device-repository');

class DeviceController {

	list(req, res) {

	}

	create(req, res) {

		repo.save(req.body)


	}

}

module.exports = new DeviceController();
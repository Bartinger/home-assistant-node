let repo = require('../repositories/device-repository');
let BaseController = require('../core/base-controller');
let pilightService = require('../services/pilight-service');

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

	control(req, res) {
		let id = req.params.id;
		let status = req.query.status;
		return repo.findById(id)
			.then((device) => {
				if (!device) {
					res.status(404).send();
					return;
				}

				pilightService.sendStatus(device, status);
				res.status(201).send();
			})
	}

}

module.exports = new DeviceController();
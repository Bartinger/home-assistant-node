let repo = require('../repositories/device-repository');
let BaseController = require('../core/base-controller');
let pilightService = require('../services/pilight-service');

class DeviceController extends BaseController {

	list(req, res) {
		return repo.list()
			.then((devices) => {
				res.render('device', {data:devices});
			})
	}

	create(req, res) {
		return this.validate({
			name: 'required',
			device_id: 'required',
			device_unit: 'required',
			origin: 'required',
			protocol: 'required',
			uuid: 'required'
		}, req)
			.then((data) => {
				return repo.save(data)
			})
			.then((data) => {
				res.render('device', {data: data});
			});
	}

	delete(req, res) {
		return repo.remove({id: req.params.id})
			.then(() => {
				res.sendStatus(201);
			});
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
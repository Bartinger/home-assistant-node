let BaseRepository = require('../core/base-repository');
let Device = require('../models/device');

class DeviceRepository extends BaseRepository {

	constructor() {
		super(Device);
	}

}

module.exports = new DeviceRepository();
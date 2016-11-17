let _ = require('lodash');
let Utils = require('../core/utils');
let fakeDevice = {
	device_id: 'A0',
	device_unit: '36',
	state: 'on',
	origin: 'receiver',
	protocol: 'clarus_switch',
	uuid: '0000-4f-7d-g9-8f6d75',
	repeats: 1
};

class SocketService {

	constructor(io) {
		this.io = io;
		io.on('connection', this.onConnect);
	}

	onConnect(socket) {
		console.log('Socket connected');
		let interval = setInterval(() => {
			let dev = _.defaults({
				uuid: Utils.generateRandomKey('fake')
			}, fakeDevice);
			socket.emit('device', dev);
		}, 3 * 1000);

		socket.on('disconnect', () => {
			console.log('Socket disconnected');
			clearInterval(interval);
		});
	}

}

module.exports = SocketService;
let _ = require('lodash');
let Utils = require('../core/utils');
let fakeDevice = {
	id: 'A0',
	unit: '36',
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
			socket.emit('device', _.defaults({
				uuid: Utils.generateRandomKey('fake')
			}, fakeDevice));
		}, 5 * 1000);

		socket.on('disconnect', () => {
			console.log('Socket disconnected');
			clearInterval(interval);
		});
	}

}

module.exports = SocketService;